import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, Button, Input } from "../../Components/index";
import {
  Mail,
  ShieldCheck,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useForgotPassword } from "../../Hooks/ForgotPasswordHook";

const RESEND_SECONDS = 60;
const OTP_LENGTH = 4;

const ForgotPassword = () => {
  const methods = useForm();
  const { handleSubmit, getValues, setValue } = methods;

  const {
    loading,
    success,
    error,
    handleSendEmail,
    handleVerifyOTP,
    handleResetPassword,
    clearState,
  } = useForgotPassword();

  // Flow: "email" -> "otp" -> "reset" -> "success"
  const [step, setStep] = useState("email");
  const [remainingTime, setRemainingTime] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /*
   * Restore resend timer + form email after refresh
   */
  useEffect(() => {
    const resendAvailableAt = localStorage.getItem(
      "forgotPasswordResendAvailableAt"
    );
    const storedEmail = localStorage.getItem("forgotPasswordEmail");

    if (storedEmail) setValue("email", storedEmail);

    if (resendAvailableAt) {
      const remaining = Math.ceil(
        (Number(resendAvailableAt) - Date.now()) / 1000
      );

      if (remaining > 0) {
        setRemainingTime(remaining);
        setStep("otp");
      } else {
        localStorage.removeItem("forgotPasswordResendAvailableAt");
      }
    }
  }, [setValue]);

  /*
   * Countdown
   */
  useEffect(() => {
    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("forgotPasswordResendAvailableAt");
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  /*
   * Email sent successfully -> move to OTP step
   */
  useEffect(() => {
    if (success && step === "email") {
      setStep("otp");

      const resendAvailableAt = Date.now() + RESEND_SECONDS * 1000;

      localStorage.setItem(
        "forgotPasswordResendAvailableAt",
        resendAvailableAt.toString()
      );

      setRemainingTime(RESEND_SECONDS);

      // Reset success/error so the same flag can be reused to detect
      // OTP verification below, instead of firing immediately.
      clearState();
    }
  }, [success, step, clearState]);

  /*
   * OTP verified successfully -> open reset-password modal
   */
  useEffect(() => {
    if (success && step === "otp") {
      localStorage.removeItem("forgotPasswordResendAvailableAt");
      setStep("reset");
      clearState();
    }
  }, [success, step, clearState]);

  /*
   * Password reset successfully -> move to success step
   */
  useEffect(() => {
    if (success && step === "reset") {
      localStorage.removeItem("forgotPasswordEmail");
      setStep("success");
      clearState();
    }
  }, [success, step, clearState]);

  /*
   * Start resend timer
   */
  const startResendTimer = () => {
    const resendAvailableAt = Date.now() + RESEND_SECONDS * 1000;

    localStorage.setItem(
      "forgotPasswordResendAvailableAt",
      resendAvailableAt.toString()
    );

    setRemainingTime(RESEND_SECONDS);
  };

  /*
   * Send email
   */
  const onSendEmail = async (data) => {
    if (loading) return;

    localStorage.setItem("forgotPasswordEmail", data.email);

    await handleSendEmail(data.email);
  };

  /*
   * Verify OTP
   */
  const onVerifyOTP = async (data) => {
    if (loading) return;

    await handleVerifyOTP({ otp: data.otp });
  };

  /*
   * Reset password (new + confirm)
   */
  const onResetPassword = async (data) => {
    if (loading) return;

    await handleResetPassword({
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  /*
   * Resend OTP
   */
  const handleResend = async () => {
    if (remainingTime > 0 || loading) return;

    const email = getValues("email");

    if (!email) return;

    await handleSendEmail(email);
    startResendTimer();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  /*
   * Cleanup
   */
  useEffect(() => {
    return () => clearState();
  }, [clearState]);

  return (
    <>
      <title>CDC JGEC | Forgot Password</title>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {step === "success" ? "Password Reset" : "Forgot Password"}
            </h1>

            {step !== "success" && step !== "reset" && (
              <p className="mt-2 text-sm text-gray-600">
                {step === "email"
                  ? "Enter your registered email address and we'll send you an OTP."
                  : "Enter the OTP sent to your email address."}
              </p>
            )}
          </div>

          <FormProvider {...methods}>
            {/* ================= EMAIL STEP ================= */}
            {step === "email" && (
              <form onSubmit={handleSubmit(onSendEmail)} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Enter a valid email address",
                        },
                      }}
                      className="w-full pr-10"
                    />

                    <Mail
                      className="absolute right-3 top-3.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium"
                >
                  {loading ? "Sending..." : "Reset Password"}
                </Button>
              </form>
            )}

            {/* ================= OTP STEP ================= */}
            {step === "otp" && (
              <form onSubmit={handleSubmit(onVerifyOTP)} className="space-y-6">
                {/* Info */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                  OTP sent successfully. Check your email.
                </div>

                {/* Email (read-only confirmation) */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      disabled
                      className="w-full pr-10 bg-gray-100"
                    />

                    <Mail
                      className="absolute right-3 top-3.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                {/* OTP */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Verification OTP
                  </label>

                  <div className="relative">
                    <Input
                      name="otp"
                      type="text"
                      placeholder={`Enter ${OTP_LENGTH}-digit OTP`}
                      maxLength={OTP_LENGTH}
                      inputMode="numeric"
                      rules={{
                        required: "OTP is required",
                        minLength: {
                          value: OTP_LENGTH,
                          message: `OTP must be ${OTP_LENGTH} digits`,
                        },
                        maxLength: {
                          value: OTP_LENGTH,
                          message: `OTP must be ${OTP_LENGTH} digits`,
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "OTP must contain only numbers",
                        },
                      }}
                      className="w-full pr-10 tracking-[0.3em]"
                    />

                    <ShieldCheck
                      className="absolute right-3 top-3.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  {remainingTime > 0 ? (
                    <p className="text-sm text-gray-500">
                      Didn't receive the OTP?{" "}
                      <span className="font-medium text-gray-700">
                        Resend in {formatTime(remainingTime)}
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline disabled:text-gray-400"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* ================= RESET (MODAL) STEP ================= */}
            {step === "reset" && (
              <form
                onSubmit={handleSubmit(onResetPassword)}
                className="space-y-6"
              >
                {/* Info */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                  OTP verified. Set your new password.
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <Input
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      rules={{
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      }}
                      className="w-full pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword((s) => !s)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showNewPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      rules={{
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === getValues("newPassword") ||
                          "Passwords do not match",
                      }}
                      className="w-full pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>

                {/* Helper text */}
                <p className="text-xs text-center text-gray-500">
                  <Lock className="inline-block mr-1" size={12} />
                  Your password is encrypted and stored securely.
                </p>
              </form>
            )}

            {/* ================= SUCCESS STEP ================= */}
            {step === "success" && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-50 rounded-full p-3">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Password Reset Successfully
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    You can now log in with your new password.
                  </p>
                </div>

                <a
                  href="/login"
                  className="inline-flex w-full items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium"
                >
                  Log In
                </a>
              </div>
            )}
          </FormProvider>

          {/* Login */}
          {step !== "success" && step !== "reset" && (
            <div className="mt-8 text-center text-sm">
              <p className="text-gray-600">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Back to Login
                </a>
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default ForgotPassword;