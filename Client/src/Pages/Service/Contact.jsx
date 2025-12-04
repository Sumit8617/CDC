import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Input, Button, Card } from "../../Components/index";

const Contact = () => {
  const methods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Message Sent Successfully!");
  };

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-6">
      {/* HEADER */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-900">Contact Us</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Have questions or want to collaborate? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* ------------------ LEFT SECTION: FORM ------------------ */}
        <Card
          variant="default"
          round="lg"
          padding="p-8"
          className="border border-gray-100 shadow-md text-left items-start"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-left">
            Send Us a Message
          </h3>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="w-full space-y-3"
            >
              {/* Full Name */}
              <Input
                name="fullName"
                label="Full Name"
                placeholder="Enter your name"
                rules={{ required: "Full Name is required" }}
              />

              {/* Email */}
              <Input
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email",
                  },
                }}
              />

              {/* Subject */}
              <Input
                name="subject"
                label="Subject"
                placeholder="What is this regarding?"
                rules={{ required: "Subject is required" }}
              />

              {/* Message */}
              <div className="text-left">
                <label className="text-gray-700 font-medium">Message</label>
                <textarea
                  {...methods.register("message", {
                    required: "Message is required",
                  })}
                  rows="5"
                  placeholder="Type your message..."
                  className={`w-full p-3 mt-1 rounded-lg border ${
                    methods.formState.errors.message
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500`}
                ></textarea>

                {methods.formState.errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {methods.formState.errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="indigo"
                size="lg"
                round="lg"
                className="w-full mt-4"
              >
                Send Message
              </Button>
            </form>
          </FormProvider>
        </Card>

        {/* ------------------ RIGHT SECTION: CONTACT INFO ------------------ */}
        <div className="space-y-8">
          <Card
            variant="default"
            round="lg"
            padding="p-8"
            className="border border-gray-100 shadow-md text-left items-start"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-left">
              Contact Information
            </h3>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
                    className="w-6"
                  />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Email</p>
                  <p className="text-gray-600">contact@yourclub.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
                    className="w-6"
                  />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Phone</p>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                    className="w-6"
                  />
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Address</p>
                  <p className="text-gray-600">
                    Jalpaiguri Government Engineering College, Jalpaiguri, 735102
                  </p>
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-4 mt-4">
                <a className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    className="w-6"
                  />
                </a>
                <a className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                    className="w-6"
                  />
                </a>
                <a className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                    className="w-6"
                  />
                </a>
              </div>
            </div>
          </Card>

          {/* ---- MAP CARD ---- */}
          <Card
            variant="outlined"
            round="lg"
            className="overflow-hidden shadow-md"
          >
            <div className="relative group w-full h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3569.196807672892!2d88.70117917501001!3d26.545944676867652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e47bce687f169d%3A0x4152036d0d736d37!2sJalpaiguri%20Government%20Engineering%20College!5e0!3m2!1sen!2sin!4v1764883854948!5m2!1sen!2sin"
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              ></iframe>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
