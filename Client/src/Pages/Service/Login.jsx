import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Input } from "../../Components/index";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, reset } = methods;
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate("/");
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Container */}
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
                  required: "Colege mail is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid mail address",
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
                    message: "Password must be at least 6 characters long",
                  },
                }}
              />
            </div>

            {/* Update this div */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 mb-6 gap-2 md:gap-0">
              <div className="flex justify-center items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline justify-center"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              round="md"
              className="w-full"
            >
              Log In
            </Button>
          </form>
        </FormProvider>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
