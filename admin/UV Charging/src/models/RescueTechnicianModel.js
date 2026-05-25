import mongoose from "mongoose";

const RescueTechnicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
    skills: [{ type: String, enum: ["battery", "charging", "motor_issue", "overheating", "towing", "flat_tyre", "general"] }],
    type: { type: String, enum: ["technician", "towing", "charging_agent"], default: "technician" },
    phone: { type: String, default: "" },
    rating: { type: Number, default: 4.8 },
    totalJobs: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    currentRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "RescueRequest", default: null },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
  },
  { timestamps: true }
);

RescueTechnicianSchema.index({ location: "2dsphere" });

export default mongoose.model("RescueTechnician", RescueTechnicianSchema);
