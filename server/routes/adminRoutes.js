/**
 * Admin Routes
 * Handles admin-related API endpoints including OTP management
 */

import express from "express";
import emailService from "../services/emailService.js";
import { adminAuth } from "../config/firebase-admin.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Admin whitelist - should match frontend
const ADMIN_WHITELIST = [
  "csidatabasenmamit@gmail.com",
  "csinmamit",
  "nnm24ad005@nmamit.in",
  // Add more admin emails as needed
];

// Rate limiting for OTP endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per windowMs
  message: "Too many OTP requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 verification attempts per windowMs
  message: "Too many verification attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware to validate request body
 */
const validateRequest = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        missingFields: missingFields,
      });
    }

    next();
  };
};

/**
 * Check if email is in admin whitelist
 */
const isWhitelistedAdmin = (email) => {
  return ADMIN_WHITELIST.includes(email.toLowerCase());
};

/**
 * POST /api/admin/send-otp
 * Send OTP to admin email
 */
router.post(
  "/send-otp",
  otpLimiter,
  validateRequest(["email", "name"]),
  async (req, res) => {
    try {
      const { email, name } = req.body;

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
        });
      }

      // Check if email is whitelisted
      if (!isWhitelistedAdmin(email)) {
        console.warn(`Unauthorized admin login attempt: ${email}`);
        return res.status(403).json({
          success: false,
          error: "Unauthorized: You are not an admin",
        });
      }

      // Send OTP email
      const result = await emailService.sendOTPEmail(email, name);

      // Log admin activity
      console.log(`Admin OTP sent to: ${email} at ${new Date().toISOString()}`);

      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        email: email,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({
        success: false,
        error: "Failed to send OTP",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

/**
 * POST /api/admin/verify-otp
 * Verify OTP for admin login
 */
router.post(
  "/verify-otp",
  verifyLimiter,
  validateRequest(["email", "otp"]),
  async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Validate OTP format (6 digits)
      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
          success: false,
          error: "Invalid OTP format",
        });
      }

      // Check if email is whitelisted
      if (!isWhitelistedAdmin(email)) {
        return res.status(403).json({
          success: false,
          error: "Unauthorized: You are not an admin",
        });
      }

      // Verify OTP
      const result = await emailService.verifyOTP(email, otp);

      if (result.success) {
        // Log successful admin login
        console.log(
          `Admin login successful: ${email} at ${new Date().toISOString()}`
        );

        // You can also create a custom token here if needed
        // const customToken = await adminAuth.createCustomToken(email)

        res.status(200).json({
          success: true,
          message: result.message,
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.message,
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({
        success: false,
        error: "Failed to verify OTP",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

/**
 * POST /api/admin/resend-otp
 * Resend OTP to admin email
 */
router.post(
  "/resend-otp",
  otpLimiter,
  validateRequest(["email", "name"]),
  async (req, res) => {
    try {
      const { email, name } = req.body;

      // Check if email is whitelisted
      if (!isWhitelistedAdmin(email)) {
        return res.status(403).json({
          success: false,
          error: "Unauthorized: You are not an admin",
        });
      }

      // Resend OTP email
      const result = await emailService.sendOTPEmail(email, name);

      console.log(
        `Admin OTP resent to: ${email} at ${new Date().toISOString()}`
      );

      res.status(200).json({
        success: true,
        message: "OTP resent successfully",
        email: email,
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      res.status(500).json({
        success: false,
        error: "Failed to resend OTP",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

/**
 * GET /api/admin/health
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin routes are healthy",
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/admin/validate-email
 * Check if email is whitelisted admin
 */
router.post("/validate-email", validateRequest(["email"]), (req, res) => {
  const { email } = req.body;

  const isAdmin = isWhitelistedAdmin(email);

  res.status(200).json({
    success: true,
    isAdmin: isAdmin,
  });
});

export default router;
