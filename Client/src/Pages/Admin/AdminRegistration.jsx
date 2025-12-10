import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input } from "../../Components/index";
import useAdminInvite from "../../Hooks/Admin/VerifyAdminInviteHook";
import useRegisterAdmin from "../../Hooks/Admin/RegisterAdminHook";

const AdminRegister = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const methods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      dob: "",
      rollNumber: "",
      role: "admin",
    },
  });

  const { handleSubmit, watch, register, reset } = methods;
  const password = watch("password");

  // Hooks
  const { inviteLoading, inviteError, inviteSuccess, verifyToken } =
    useAdminInvite();
  const {
    loading: registerLoading,
    error: registerError,
    success: registerSuccess,
    register: registerAdmin,
  } = useRegisterAdmin();

  // Verify invite token from URL
  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setMessage("Invalid or missing token");
      return;
    }
    setToken(t);

    const verifyInvite = async () => {
      try {
        const result = await verifyToken(t);
        if (result?.email && result?.fullName) {
          reset({ fullName: result.fullName, email: result.email });
        } else {
          setMessage("Invalid or expired invite link");
        }
      } catch (err) {
        setMessage("Error verifying invite token", err);
      }
    };

    verifyInvite();
  }, [searchParams, reset, verifyToken]);

  const onSubmit = async (data) => {
    if (!token) {
      setMessage("Invalid invite token");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      // Complete registration
      await registerAdmin(
        token,
        data.password,
        data.mobileNumber,
        data.rollNumber,
        data.dob,
        data.confirmPassword
      );
      setMessage("Admin registered successfully! Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (err) {
      setMessage(err?.message || "Registration failed");
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
              Complete your admin registration using your invite link.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Admin Registration
          </h2>

          {(message ||
            inviteError ||
            inviteSuccess ||
            registerError ||
            registerSuccess) && (
            <p
              className={`text-center mb-4 font-medium ${
                inviteError || registerError ? "text-red-500" : "text-green-500"
              }`}
            >
              {message ||
                inviteError ||
                inviteSuccess ||
                registerError ||
                registerSuccess}
            </p>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-2">
              <Input
                name="fullName"
                label="Full Name"
                placeholder="Full Name"
                rules={{ required: "Full name is required" }}
                readOnly
                disabled
              />
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                rules={{ required: "Email is required" }}
                readOnly
                disabled
              />
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
                    type="tel"
                    placeholder="2310110XXXX"
                    rules={{ required: "Roll number is required" }}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    {...register("role")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    disabled
                  >
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Input
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    rules={{ required: "DOB is required" }}
                  />
                </div>
              </div>
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
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={inviteLoading || registerLoading}
              >
                {inviteLoading || registerLoading
                  ? "Registering..."
                  : "Register"}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
