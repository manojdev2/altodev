import mongoose from "mongoose";

const RescueRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    issueType: {
      type: String,
      enum: ["battery_dead", "charging_failed", "motor_issue", "overheating", "accident", "flat_tyre", "other"],
      default: "other",
    },
    issueDescription: { type: String, default: "" },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    voiceTranscript: { type: String, default: "" },
    guidanceText: { type: String, default: "" },

    userLatitude: { type: Number, required: true },
    userLongitude: { type: Number, required: true },
    userAddress: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "dispatched", "en_route", "arrived", "resolved", "cancelled"],
      default: "pending",
    },

    assignedTechnicianId: { type: mongoose.Schema.Types.ObjectId, ref: "RescueTechnician", default: null },
    technicianName: { type: String, default: "" },
    technicianType: { type: String, default: "" },
    technicianRating: { type: Number, default: 0 },

    etaMinutes: { type: Number, default: 0 },
    distanceKm: { type: Number, default: 0 },

    // Technician's starting coordinates (used for interpolated movement simulation)
    techStartLatitude: { type: Number, default: 0 },
    techStartLongitude: { type: Number, default: 0 },

    dispatchedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("RescueRequest", RescueRequestSchema);
