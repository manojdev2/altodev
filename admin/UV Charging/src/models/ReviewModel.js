import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stationId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    // Link to charging session (optional — set when review comes from charging flow)
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChargingSession",
      default: null,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ReviewModel = mongoose.model("Review", ReviewSchema);
export default ReviewModel;
