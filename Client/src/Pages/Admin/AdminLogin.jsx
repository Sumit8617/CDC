import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Card, Button, Input } from "../../Components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useLogin from "../../Hooks/LoginHook";

const AdminLogin = () => {
  console.log("Admin Login Page rendering");
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
      mobileNumber: "",
    },
  });

  const { handleSubmit, reset, setError } = methods;
  const navigate = useNavigate();
  const { handleAdminLogin, loading } = useLogin();

  // Get user from Redux
  const { user } = useSelector((state) => state.auth);
  const [showErr, setShowErr] = useState(false);

  // Redirect when redux user updated
  useEffect(() => {
    if (!user) return;

    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      setShowErr(true);
    }
  }, [user, navigate]);

  //  State for show/hide password
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await handleAdminLogin(data);
      reset();
    } catch (err) {
      setError("password", {
        type: "server",
        message: err || "Invalid credentials",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 border-2 w-full">
      {/* === Login Form === */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10">
        {/* Card with background image */}
        <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200 bg-[url('/CollegeLogo.png')] bg-cover bg-center bg-no-repeat relative overflow-hidden rounded-xl">
          {/* Optional overlay for readability */}
          <div className="absolute inset-0 bg-white/20 rounded-xl backdrop-blur-[2px]"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-ubuntu font-semibold text-gray-800 mb-8 text-center">
              Admin Login
            </h2>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your admin email"
                  className="border-2 border-black text-black"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  }}
                />

                {/* Mobile Number */}
                <Input
                  name="mobileNumber"
                  type="tel"
                  placeholder="Enter your Mobile Number"
                  rules={{
                    required: "Mobile Number is required",
                    maxLength: {
                      value: 10,
                      message: "Mobile Number must be 10 digits long",
                    },
                  }}
                />

                {/* Password with show/hide toggle */}
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="border-2 border-black text-black pr-10
      [&::-ms-reveal]:hidden [&::-ms-clear]:hidden
      [appearance:textfield]"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full mt-4"
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </FormProvider>

            <p
              onClick={() => navigate("/forgot-password")}
              className="text-center text-blue-600 mt-6 text-sm font-semibold hover:cursor-pointer hover:underline"
            >
              Forgot password?
            </p>

            <p
              className="text-center text-gray-600 mt-6 text-sm"
              onClick={() => navigate("/login")}
            >
              Not an admin?{" "}
              <span className="text-blue-600 hover:underline font-medium hover:cursor-pointer">
                Go back to user login
              </span>
            </p>
          </div>
        </Card>

        {/* popup message for unauthorized user */}
        {showErr && (
          <div className="fixed inset-0 bg-slate-900/10 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <Card
              variant="default"
              round="md"
              padding="p-8"
              className="w-auto flex flex-col items-center justify-center text-center"
            >
              <p className="text-red-600 text-lg font-semibold mb-4">
                Something went wrong! Unauthorized access. If you are a user go
                to user login
              </p>

              <Button className="mt-4" onClick={() => setShowErr(false)}>
                Close
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
