import RescueRequest from "../models/RescueRequestModel.js";
import RescueTechnician from "../models/RescueTechnicianModel.js";

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const GUIDANCE_MAP = {
  battery_dead:
    "Stay with your vehicle. Turn off all accessories to preserve remaining power. Our technician is en route with a portable charger.",
  charging_failed:
    "Check that the charging port is clear of debris. Try a soft restart of your vehicle. Our EV specialist will diagnose the charging module on arrival.",
  motor_issue:
    "Do not attempt to restart the motor repeatedly. Move to a safe location if possible. Our EV-certified technician is dispatched.",
  overheating:
    "Turn off the vehicle immediately. Do not open the battery compartment. Move away from the vehicle and wait in a safe area.",
  flat_tyre:
    "Apply the parking brake and switch on your hazard lights. Our towing partner is on the way.",
  accident:
    "Ensure your safety first. Call emergency services if required. Our team will coordinate towing and on-site assistance.",
  other:
    "Stay calm and remain with your vehicle. Our team will assess and resolve your issue upon arrival.",
};

const SEVERITY_LABELS = {
  low: "Minor",
  medium: "Moderate",
  high: "Serious",
  critical: "Critical",
};

// ─── Create Rescue Request ───────────────────────────────────────────────────
export const CreateRescueRequest = async (req, res) => {
  try {
    const {
      issueType = "other",
      issueDescription = "",
      severity = "medium",
      voiceTranscript = "",
      userLatitude,
      userLongitude,
      userAddress = "",
    } = req.body;

    if (!userLatitude || !userLongitude) {
      return res.status(400).json({ status: "Error", message: "User location is required." });
    }

    const technician = await RescueTechnician.findOne({
      isAvailable: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [userLongitude, userLatitude] },
          $maxDistance: 50000, // 50 km radius
        },
      },
    });

    if (!technician) {
      return res.status(503).json({
        status: "Error",
        message: "No technicians available in your area right now. Please try again shortly.",
      });
    }

    const distKm = haversineKm(userLatitude, userLongitude, technician.latitude, technician.longitude);
    const etaMins = Math.max(3, Math.round((distKm / 30) * 60)); // 30 km/h city average, min 3 mins

    const rescue = await RescueRequest.create({
      userId: req.user._id,
      issueType,
      issueDescription,
      severity,
      voiceTranscript,
      guidanceText: GUIDANCE_MAP[issueType] ?? GUIDANCE_MAP.other,
      userLatitude,
      userLongitude,
      userAddress,
      status: "dispatched",
      assignedTechnicianId: technician._id,
      technicianName: technician.name,
      technicianType: technician.type,
      technicianRating: technician.rating,
      etaMinutes: etaMins,
      distanceKm: Math.round(distKm * 10) / 10,
      techStartLatitude: technician.latitude,
      techStartLongitude: technician.longitude,
      dispatchedAt: new Date(),
    });

    await RescueTechnician.findByIdAndUpdate(technician._id, {
      isAvailable: false,
      currentRequestId: rescue._id,
    });

    return res.status(200).json({
      status: "Success",
      data: {
        rescueId: rescue._id,
        status: rescue.status,
        issueType: rescue.issueType,
        severity: rescue.severity,
        severityLabel: SEVERITY_LABELS[rescue.severity] ?? "Moderate",
        guidanceText: rescue.guidanceText,
        technicianName: rescue.technicianName,
        technicianType: rescue.technicianType,
        technicianRating: rescue.technicianRating,
        etaMinutes: rescue.etaMinutes,
        distanceKm: rescue.distanceKm,
        techLocation: { latitude: technician.latitude, longitude: technician.longitude },
        userLocation: { latitude: userLatitude, longitude: userLongitude },
      },
    });
  } catch (err) {
    return res.status(500).json({ status: "Error", message: err.message });
  }
};

// ─── Get Rescue Status (polling) ─────────────────────────────────────────────
export const GetRescueStatus = async (req, res) => {
  try {
    const rescue = await RescueRequest.findById(req.params.id);
    if (!rescue) return res.status(404).json({ status: "Error", message: "Rescue request not found." });

    const now = Date.now();
    const dispatchedAt = rescue.dispatchedAt?.getTime() ?? now;
    const totalEtaMs = rescue.etaMinutes * 60 * 1000;
    const elapsed = now - dispatchedAt;
    const progress = Math.min(elapsed / totalEtaMs, 1);

    // Interpolate technician position: start → user location
    const techLat =
      rescue.techStartLatitude + (rescue.userLatitude - rescue.techStartLatitude) * progress;
    const techLng =
      rescue.techStartLongitude + (rescue.userLongitude - rescue.techStartLongitude) * progress;

    const remainingMins = Math.max(0, Math.round(rescue.etaMinutes * (1 - progress)));

    let status = rescue.status;
    if (status !== "cancelled" && status !== "resolved") {
      if (progress >= 0.97) {
        status = "arrived";
      } else if (progress > 0.05) {
        status = "en_route";
      }
      if (status !== rescue.status) {
        await RescueRequest.findByIdAndUpdate(rescue._id, { status });
      }
    }

    return res.status(200).json({
      status: "Success",
      data: {
        rescueId: rescue._id,
        status,
        issueType: rescue.issueType,
        severity: rescue.severity,
        severityLabel: SEVERITY_LABELS[rescue.severity] ?? "Moderate",
        guidanceText: rescue.guidanceText,
        technicianName: rescue.technicianName,
        technicianType: rescue.technicianType,
        technicianRating: rescue.technicianRating,
        etaMinutes: remainingMins,
        distanceKm: rescue.distanceKm,
        progress,
        techLocation: { latitude: techLat, longitude: techLng },
        userLocation: { latitude: rescue.userLatitude, longitude: rescue.userLongitude },
      },
    });
  } catch (err) {
    return res.status(500).json({ status: "Error", message: err.message });
  }
};

// ─── Cancel Rescue ───────────────────────────────────────────────────────────
export const CancelRescue = async (req, res) => {
  try {
    const rescue = await RescueRequest.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!rescue) return res.status(404).json({ status: "Error", message: "Rescue request not found." });

    if (rescue.assignedTechnicianId) {
      await RescueTechnician.findByIdAndUpdate(rescue.assignedTechnicianId, {
        isAvailable: true,
        currentRequestId: null,
      });
    }

    return res.status(200).json({ status: "Success", message: "Rescue request cancelled." });
  } catch (err) {
    return res.status(500).json({ status: "Error", message: err.message });
  }
};

// ─── Seed Mock Technicians (dev/admin endpoint) ──────────────────────────────
export const SeedTechnicians = async (req, res) => {
  try {
    await RescueTechnician.deleteMany({});

    const technicians = [
      {
        name: "Arjun Sharma",
        type: "technician",
        skills: ["battery", "charging", "general"],
        rating: 4.9,
        totalJobs: 312,
        latitude: 12.9352,
        longitude: 77.6245,
      },
      {
        name: "Priya Nair",
        type: "technician",
        skills: ["motor_issue", "general", "battery"],
        rating: 4.8,
        totalJobs: 248,
        latitude: 12.9716,
        longitude: 77.5946,
      },
      {
        name: "Ravi Kumar",
        type: "towing",
        skills: ["towing", "flat_tyre"],
        rating: 4.7,
        totalJobs: 189,
        latitude: 12.9121,
        longitude: 77.6448,
      },
      {
        name: "Aisha Mohammed",
        type: "charging_agent",
        skills: ["charging", "battery"],
        rating: 4.9,
        totalJobs: 405,
        latitude: 12.985,
        longitude: 77.5533,
      },
      {
        name: "Suresh Pillai",
        type: "technician",
        skills: ["general", "overheating", "motor_issue"],
        rating: 4.6,
        totalJobs: 176,
        latitude: 12.958,
        longitude: 77.701,
      },
      {
        name: "Meena Reddy",
        type: "charging_agent",
        skills: ["charging", "battery", "general"],
        rating: 4.8,
        totalJobs: 291,
        latitude: 12.925,
        longitude: 77.58,
      },
    ].map((t) => ({
      ...t,
      isAvailable: true,
      location: { type: "Point", coordinates: [t.longitude, t.latitude] },
    }));

    await RescueTechnician.insertMany(technicians);

    return res.status(200).json({
      status: "Success",
      message: `Seeded ${technicians.length} mock rescue technicians.`,
      count: technicians.length,
    });
  } catch (err) {
    return res.status(500).json({ status: "Error", message: err.message });
  }
};
