import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input } from "../../Components/index";
import useSignup from "../../Hooks/AuthHooks";
import axios from "axios";

const AdminRegister = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // TODO: OTP Should be removed from this
  const methods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      otp: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      dob: "",
      rollNumber: "",
      role: "admin",
    },
  });

  const { handleSubmit, watch, register, getValues, reset } = methods;
  const password = watch("password");

  const { handleSendOtp, handleVerifyOtp, otpSent, otpVerified, error } =
    useSignup(); // Add OTP hooks

  // Get token from URL
  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setMessage("Invalid or missing token");
    } else {
      setToken(t);
    }
  }, [searchParams]);

  const onSendOtp = async () => {
    const email = getValues("email");
    const fullName = getValues("fullName");

    if (!email || !fullName) {
      alert("Please enter Full Name and Email first");
      return;
    }

    try {
      await handleSendOtp({ email, fullName });
      alert("OTP sent successfully!");
    } catch {
      alert("Failed to send OTP");
    }
  };

  const onVerifyOtp = async () => {
    const otp = getValues("otp");
    if (!otp) return alert("Enter OTP before verifying");

    try {
      await handleVerifyOtp(otp);
      alert("OTP Verified!");
    } catch {
      alert("Invalid OTP");
    }
  };

  const onSubmit = async (data) => {
    if (!token) {
      setMessage("Invalid or missing token");
      return;
    }

    if (!otpVerified) {
      alert("Please verify your OTP before signing up.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/admin/register", {
        fullName: data.fullName,
        password: data.password,
        token,
      });

      if (response.data.status === 200) {
        setMessage("Admin registered successfully! Redirecting...");
        reset();
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        setMessage(response.data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-gray-50">
      <div className="flex w-full min-h-screen shadow-xl overflow-hidden bg-white rounded">
        {/* LEFT SECTION */}
        <div className="hidden md:flex relative flex-col justify-center items-center w-1/2 text-white bg-linear-to-br from-indigo-700 via-blue-700 to-sky-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center p-4">
            <h2 className="text-4xl font-bold font-ubuntu">Admin Invite</h2>
            <p className="mt-4 text-lg">
              Complete your registration using the invite link.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Admin Registration
          </h2>

          {message && (
            <p className="text-center mb-4 text-red-500 font-medium">
              {message}
            </p>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {/* FULL NAME */}
              <Input
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                rules={{ required: "Full name is required" }}
              />

              {/* EMAIL + SEND OTP */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    rules={{ required: "Email is required" }}
                  />
                </div>

                {!otpSent && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onSendOtp}
                    disabled={loading}
                    className="h-[42px]"
                  >
                    Send OTP
                  </Button>
                )}
              </div>

              {/* OTP + VERIFY */}
              {otpSent && (
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      name="otp"
                      placeholder="Enter OTP"
                      type="number"
                      rules={{ required: "OTP is required" }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    round="full"
                    onClick={onVerifyOtp}
                    disabled={otpVerified}
                    className="h-[30px]"
                  >
                    {otpVerified ? "Verified" : "Verify"}
                  </Button>
                </div>
              )}

              {/* MOBILE NUMBER + ROLL NUMBER */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    name="mobileNumber"
                    label="Mobile Number"
                    type="tel"
                    placeholder="9876543210"
                    rules={{ required: "Mobile number is required" }}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    name="rollNumber"
                    label="College Roll Number"
                    type="number"
                    placeholder="2310110XXXX"
                    rules={{ required: "Roll number is required" }}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden"
                  />
                </div>
              </div>

              {/* ROLE + DOB */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Select Role
                  </label>
                  <select
                    {...register("role")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  >
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex-1">
                  <Input
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    rules={{ required: "Date of Birth is required" }}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                }}
              />

              {/* CONFIRM PASSWORD */}
              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                rules={{
                  required: "Confirm password",
                  validate: (v) => v === password || "Passwords do not match",
                }}
              />

              {/* SUBMIT BUTTON */}
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </Button>

              {error && (
                <p className="text-red-500 text-center mt-2">{error}</p>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
