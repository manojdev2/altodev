import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    userId:             { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:               { type: String, required: true },  // full display name e.g. "Tata Nexon EV"
    model:              { type: String, default: "" },     // was required — now optional
    image:              { type: String, default: "" },
    isActive:           { type: Boolean, default: false },
    connectorType:      { type: String, default: "" },
    batteryCapacityKwh: { type: Number, default: 0 },
    // ── Fields required by alto FE Vehicle type ──
    plate:                 { type: String, default: "" },
    maxRangeKm:            { type: Number, default: 0 },
    currentBatteryPct:     { type: Number, default: 80 },
    currentRangeKm:        { type: Number, default: 0 },
    preferredMinChargePct: { type: Number, default: 20 },
    preferredMaxChargePct: { type: Number, default: 80 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const VehicleModel = mongoose.model("Vehicle", VehicleSchema);
export default VehicleModel;
