
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import router from "./routes/routes.js";
import adminRouter from "./routes/adminRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import { corsMiddleware } from "./utils/corsMiddel.js";
import { setupSwagger } from "./config/swagger.js";

// Custom mongo sanitize for Express 5 (req.query is read-only)
const sanitizeValue = (val) => {
  if (typeof val === "string" && val.startsWith("$")) return "";
  if (typeof val === "object" && val !== null) {
    for (const key of Object.keys(val)) {
      if (key.startsWith("$")) delete val[key];
      else val[key] = sanitizeValue(val[key]);
    }
  }
  return val;
};
const mongoSanitize = (req, _res, next) => {
  if (req.body) sanitizeValue(req.body);
  if (req.params) sanitizeValue(req.params);
  next();
};

const app = express();

// Security Middleware
app.use(cookieParser());
app.use(helmet());
app.use(corsMiddleware);
app.use(hpp());

// Parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(mongoSanitize);

// Serve uploaded images as static files → /uploads/filename.jpg
app.use("/uploads", express.static(path.resolve("uploads")));

// Swagger API Docs (before rate limiter so docs are always accessible)
setupSwagger(app);

// Rate Limiting (skip Swagger routes)
const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  skip: (req) => req.path.startsWith("/api-docs"),
});
app.use(limit);

app.set('etag', false);

// Routes
app.use('/api/v1', router);
app.use('/api/v1', adminRouter);
app.use('/api/v1', paymentRouter);  // SSLCommerz callbacks + Stripe webhook + payment status polling

// Global error handler (Express 5)
app.use(function errorHandler(err, req, res, next) {
  console.error("ERROR HANDLER:", err);
  return res.status(500).json({ status: "fail", message: err.message || "Internal server error." });
});

export default app;
