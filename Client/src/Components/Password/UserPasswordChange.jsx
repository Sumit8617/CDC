import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useChangePassword from "../../Hooks/AuthHooks";
import { Card, Button, Input } from "../index";

const UserChangePassword = () => {
  const { handleChangePassword, loading, error, success } = useChangePassword();

  const methods = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit } = methods;

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();

  const toggleVisibility = (type) => {
    setShowPassword((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const onSubmit = async (data) => {
    try {
      await handleChangePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="p-8 rounded-2xl shadow-sm border border-gray-100 bg-white w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Security Settings
      </h2>

      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Change Password
        </h3>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Password */}
              <div className="relative">
                <Input
                  name="oldPassword"
                  label="Current Password"
                  type={showPassword.current ? "text" : "password"}
                  placeholder="Enter current password"
                  rules={{ required: "Current password is required" }}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => toggleVisibility("current")}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showPassword.current ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <Input
                  name="newPassword"
                  label="New Password"
                  type={showPassword.new ? "text" : "password"}
                  placeholder="Enter new password"
                  rules={{ required: "New password is required" }}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => toggleVisibility("new")}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword.confirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  rules={{
                    required: "Confirm password is required",
                  }}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => toggleVisibility("confirm")}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}

            {/* Success message */}
            {success && (
              <p className="text-green-600 mt-4 font-medium">
                Password updated successfully!
              </p>
            )}

            <div className="mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </section>
    </Card>
  );
};

export default UserChangePassword;
