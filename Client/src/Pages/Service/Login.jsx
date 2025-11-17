import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input } from "../../Components/index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useLogin from "../../Hooks/LoginHook";

const Login = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, reset, setError } = methods;

  const navigate = useNavigate();
  const { handleLogin, loading } = useLogin();

  // Get user from Redux
  const { user } = useSelector((state) => state.auth);

  // Redirect when redux user updated
  useEffect(() => {
    if (!user) return;

    if (user.role === "user") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      await handleLogin(data);
      reset();
    } catch (err) {
      setError("password", {
        type: "server",
        message: err || "Invalid credentials",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 ">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Welcome Back
        </h2>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="email"
                label="Enter your college mail"
                type="email"
                placeholder="Enter your mail"
                rules={{
                  required: "College email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email",
                  },
                }}
              />

              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              round="md"
              className="w-full mt-5"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </FormProvider>

        <p
          className="mt-5 text-blue-600 hover:underline font-medium hover:cursor-pointer text-center"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </p>

        <p className="text-center text-sm text-gray-600 mt-2">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 hover:underline font-medium hover:cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
