import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Function to send OTP
export const sendOTP = async (phone) => {
  if (!phone) throw new Error("Phone number is required");

  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({ to: phone, channel: "sms" });

  return verification;
};

// ✅ Function to verify OTP
export const verifyOTP = async (phone, otp) => {
  if (!phone || !otp) throw new Error("Phone and OTP are required");

  const verificationCheck = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({ to: phone, code: otp });

  return verificationCheck;
};
