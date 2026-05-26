import {
  AddPaymentCardService,
  AddVehicleService,
  CancelBookingService,
  ConfirmArrivalService,
  ConfirmPaymentService,
  CreateBookingService,
  DeleteVehicleService,
  ExtendSessionService,
  ForgotPasswordService,
  GetBookingsService,
  GetChargingStationService,
  GetChargingStatusService,
  GetChargingSummaryService,
  GetConnectorTypesService,
  GetFavouriteStationsService,
  ToggleFavouriteStationService,
  GetNearestStationsService,  GetNavigationService,
  GetNotificationInboxService,
  GetNotificationsService,
  UpdateNotificationsService,
  GetPaymentMethodService,
  GetProfileService,
  GetSavedLocationsService,
  ToggleSavedLocationService,
  GetStationDetailService,
  GetUserLocationService,
  GetVehicleBrandsService,
  GetVehicleModelDetailService,
  GetVehicleModelsByBrandService,
  GetVehiclesService,
  LoginService,
  MarkAllNotificationsReadService,
  MarkNotificationReadService,
  ReBookingService,
  RegisterService,
  ResendOTPService,
  ResetPasswordService,
  StartChargingService,
  StopChargingService,
  SubmitChargingReviewService,
  SubmitReviewService,
  ToggleVehicleService,
  UpdateProfileService,
  UpdateUserLocationService,
  ValidateQRService,
  PayChargingSessionService,
  GetAvailableSlotsService,
  VerifyForgotOTPService,
  VerifyOTPService,
  GetAppSettingsService,
} from "../services/userService.js";
import VehicleModel from "../models/VehicleModel.js";

// ─── Register ───
export const Register = async (req, res) => {
  const result = await RegisterService(req);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Login ───
export const Login = async (req, res) => {
  const result = await LoginService(req);
  if (result.status === "Success") {
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: false,
    };
    res.cookie("token", result.token, cookieOptions);
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};

// ─── Verify OTP ───
export const VerifyOTP = async (req, res) => {
  const result = await VerifyOTPService(req);
  if (result.status === "Success") {
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: false,
    };
    res.cookie("token", result.token, cookieOptions);
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};

// ─── Resend OTP ───
export const ResendOTP = async (req, res) => {
  const result = await ResendOTPService(req);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Forgot Password ───
export const ForgotPassword = async (req, res) => {
  const result = await ForgotPasswordService(req);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Verify Forgot Password OTP ───
export const VerifyForgotOTP = async (req, res) => {
  const result = await VerifyForgotOTPService(req);
  const statusCode = result.status === "Success" ? 200 : 401;
  return res.status(statusCode).json(result);
};

// ─── Reset Password ───
export const ResetPassword = async (req, res) => {
  const result = await ResetPasswordService(req);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Logout ───
export const UserLgout = async (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
    httpOnly: false,
  };
  res.cookie("token", "", cookieOptions);
  return res.status(200).json({ status: "success" });
};

// ─── Get Profile ───
export const GetProfile = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await GetProfileService(user_id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Update Profile ───
export const UpdateProfile = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await UpdateProfileService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get My Vehicles ───
export const GetVehicles = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await GetVehiclesService(user_id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Saved Locations ───
export const GetSavedLocations = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await GetSavedLocationsService(user_id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Toggle Saved Location (Save / Unsave) ───
export const ToggleSavedLocation = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await ToggleSavedLocationService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Favourite Stations ───
export const GetFavouriteStations = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await GetFavouriteStationsService(user_id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Toggle Favourite Station (Favourite / Unfavourite) ───
export const ToggleFavouriteStation = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await ToggleFavouriteStationService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Notifications ───
export const GetNotifications = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await GetNotificationsService(user_id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Update Notification Settings ───
export const UpdateNotifications = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await UpdateNotificationsService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Notification Inbox (with pagination) ───
export const GetNotificationInbox = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await GetNotificationInboxService(user_id, req.query);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Mark Notification as Read ───
export const MarkNotificationRead = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params;
  const result = await MarkNotificationReadService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Mark All Notifications as Read ───
export const MarkAllNotificationsRead = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await MarkAllNotificationsReadService(user_id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Submit Review ───
export const SubmitReview = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await SubmitReviewService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Delete Vehicle ───
export const DeleteVehicle = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params;
  const result = await DeleteVehicleService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Nearest Stations ───
export const GetNearestStations = async (req, res) => {
  const { latitude, longitude } = req.query;
  const result = await GetNearestStationsService(latitude, longitude);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Station Detail (map pin click) ───
export const GetStationDetail = async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, date } = req.query;  // user's current location (optional) + selected date
  const result = await GetStationDetailService(id, latitude, longitude, date);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Available Slots for a Station on a Specific Date ───
export const GetAvailableSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  const result = await GetAvailableSlotsService(id, date);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Vehicle Brands ───
export const GetVehicleBrands = async (req, res) => {
  const result = await GetVehicleBrandsService();
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Connector Types (Step 3 of Set-Up Vehicle) ───
export const GetConnectorTypes = async (req, res) => {
  const result = await GetConnectorTypesService();
  return res.status(200).json(result);
};

// ─── Get Vehicle Models By Brand ───
export const GetVehicleModelsByBrand = async (req, res) => {
  const { brandId } = req.params;
  const result = await GetVehicleModelsByBrandService(brandId);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Vehicle Model Detail ───
export const GetVehicleModelDetail = async (req, res) => {
  const { modelId } = req.params;
  const result = await GetVehicleModelDetailService(modelId);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Add Vehicle ───
export const AddVehicle = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await AddVehicleService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Toggle Vehicle Active/Disable ───
export const ToggleVehicle = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params;
  const result = await ToggleVehicleService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Update Vehicle (full update) ───
export const UpdateMyVehicle = async (req, res) => {
  try {
    const user_id = req.headers.user_id;
    const { id } = req.params;
    const allowed = [
      'name', 'model', 'plate', 'connectorType', 'batteryCapacityKwh',
      'maxRangeKm', 'currentBatteryPct', 'currentRangeKm',
      'preferredMinChargePct', 'preferredMaxChargePct', 'isActive',
    ];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const vehicle = await VehicleModel.findOneAndUpdate(
      { _id: id, userId: user_id },
      { $set: update },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ status: 'Error', message: 'Vehicle not found' });
    return res.status(200).json({ status: 'Success', data: vehicle });
  } catch (err) {
    return res.status(500).json({ status: 'Error', message: err.message });
  }
};

// ─── Get Booking List ───
export const GetBookings = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await GetBookingsService(user_id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Create Booking ───
export const CreateBooking = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await CreateBookingService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Re-Booking / Reschedule ───
export const ReBooking = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params;
  const result = await ReBookingService(user_id, id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Cancel Booking ───
export const CancelBooking = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params;
  const result = await CancelBookingService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Payment Method (booking summary + saved cards) ───
export const GetPaymentMethod = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // bookingId
  const result = await GetPaymentMethodService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Confirm Payment → Booking Success ───
export const ConfirmPayment = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // bookingId
  const result = await ConfirmPaymentService(user_id, id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Stripe: Create Payment Intent (Flutter endpoint) ───
export const StripeCreateIntent = async (req, res) => {
  const user_id = req.headers.user_id;
  const { bookingId, amount, savedCardId } = req.body;
  if (!bookingId) return res.status(400).json({ status: "fail", message: "bookingId is required." });
  const body = { paymentMethod: "stripe", savedCardId };
  const result = await ConfirmPaymentService(user_id, bookingId, body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── SSLCommerz: Initiate Payment (Flutter endpoint) ───
export const SSLCommerzInitiate = async (req, res) => {
  const user_id = req.headers.user_id;
  const { bookingId, amount } = req.body;
  if (!bookingId) return res.status(400).json({ status: "fail", message: "bookingId is required." });
  const body = { paymentMethod: "sslcommerz" };
  const result = await ConfirmPaymentService(user_id, bookingId, body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Stripe: Verify Payment after client-side confirmation (Flutter endpoint) ───
export const StripeVerifyPayment = async (req, res) => {
  const user_id = req.headers.user_id;
  const { bookingId, stripePaymentIntentId } = req.body;
  if (!bookingId || !stripePaymentIntentId) return res.status(400).json({ status: "fail", message: "bookingId and stripePaymentIntentId are required." });
  const body = { paymentMethod: "stripe", stripePaymentIntentId };
  const result = await ConfirmPaymentService(user_id, bookingId, body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Payment Methods (Flutter endpoint — bookingId in query/body) ───
export const GetPaymentMethods = async (req, res) => {
  const user_id = req.headers.user_id;
  const bookingId = req.query.bookingId || req.body?.bookingId;
  if (!bookingId) return res.status(400).json({ status: "fail", message: "bookingId is required." });
  const result = await GetPaymentMethodService(user_id, bookingId);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Add Payment Card ───
export const AddPaymentCard = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await AddPaymentCardService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Navigation Data (Go to Station) ───
export const GetNavigation = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // bookingId
  const result = await GetNavigationService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Confirm Arrival (Arrival Confirm popup) ───
export const ConfirmArrival = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // bookingId
  const result = await ConfirmArrivalService(user_id, id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Update Real-time Car Location (PUT /Bookings/:id/location) ───
export const UpdateUserLocation = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // bookingId
  const result = await UpdateUserLocationService(user_id, id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Get Latest Car Location (GET /Bookings/:id/location) ───
export const GetUserLocation = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // bookingId
  const result = await GetUserLocationService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ════════════════════════════════════════════════════════════
// CHARGING SESSION CONTROLLERS
// ════════════════════════════════════════════════════════════

// ─── Screen 1: In Charging Station (GET /ChargingStation/:bookingId) ───
export const GetChargingStation = async (req, res) => {
  const user_id = req.headers.user_id;
  const { bookingId } = req.params;
  const result = await GetChargingStationService(user_id, bookingId);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Validate QR Code (POST /ChargingSession/validate-qr) ───
export const ValidateQR = async (req, res) => {
  const user_id = req.headers.user_id;
  const result = await ValidateQRService(user_id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Screen 2: Start Charging → Charging Started Successfully (POST /ChargingSession/:id/start) ───
export const StartCharging = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // sessionId
  const result = await StartChargingService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Screen 3: Live Charging Status (GET /ChargingSession/:id/status) ───
export const GetChargingStatus = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // sessionId
  const result = await GetChargingStatusService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Screen 4: Stop Charging (POST /ChargingSession/:id/stop) ───
export const StopCharging = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // sessionId
  const result = await StopChargingService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Screen 5: Extend Session (POST /ChargingSession/:id/extend) ───
export const ExtendSession = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // sessionId
  const result = await ExtendSessionService(user_id, id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Screen 6: Charging Summary / Stopped (GET /ChargingSession/:id/summary) ───
export const GetChargingSummary = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // sessionId
  const result = await GetChargingSummaryService(user_id, id);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Pay Extension Charges (POST /ChargingSession/:id/pay) ───
export const PayChargingSession = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // sessionId
  const result = await PayChargingSessionService(user_id, id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Give Review after Charging (POST /ChargingSession/:id/review) ───
export const SubmitChargingReview = async (req, res) => {
  const user_id = req.headers.user_id;
  const { id } = req.params; // sessionId
  const result = await SubmitChargingReviewService(user_id, id, req.body);
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};

// ─── Public App Settings (GET /app/settings — no auth) ───
export const GetAppSettings = async (_req, res) => {
  const result = await GetAppSettingsService();
  const statusCode = result.status === "Success" ? 200 : 400;
  return res.status(statusCode).json(result);
};