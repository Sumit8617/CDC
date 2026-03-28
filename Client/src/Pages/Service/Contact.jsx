import { useEffect, useState, useRef, memo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Button, Card } from "../../Components/index";
import useContact from "../../Hooks/ContactHook";

// ─── Animation variants (defined OUTSIDE component — never recreated) ───────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// Pre-defined animation objects — prevent new object allocation on every render
const floatAnimation = { y: [0, -8, 0] };
const floatTransition = (delay) => ({
  duration: 3,
  repeat: Infinity,
  delay,
  ease: "easeInOut",
});
const arrowAnimation = { x: [0, 5, 0] };
const arrowTransition = { duration: 1.5, repeat: Infinity };

// Static data lifted out of component scope — never recreated on re-render
const SOCIALS = [
  {
    icon: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
    label: "LinkedIn",
  },
  {
    icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
    label: "Twitter",
  },
  {
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
    label: "Instagram",
  },
];

const DOTS = [0, 1, 2, 3, 4];

// ─── memo: BackgroundShapes has no props — renders exactly once ──────────────
const BackgroundShapes = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
    <motion.div
      className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        willChange: "transform",
      }}
      animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -bottom-40 -right-32 w-[700px] h-[700px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        willChange: "transform",
      }}
      animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/3 left-1/2 w-96 h-96 rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        willChange: "transform, opacity",
      }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-24 right-24 w-40 h-40 border border-indigo-200/40 rounded-2xl rotate-12"
      style={{ willChange: "transform, opacity" }}
      animate={{ rotate: [12, 20, 12], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-32 left-20 w-28 h-28 border border-purple-200/40 rounded-full"
      style={{ willChange: "transform, opacity" }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-1/2 right-10 w-16 h-16 bg-indigo-400/5 rounded-lg rotate-45"
      style={{ willChange: "transform" }}
      animate={{ rotate: [45, 65, 45] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
));
BackgroundShapes.displayName = "BackgroundShapes";

// ─── memo: SuccessModal only re-renders when isOpen or message changes ───────
const SuccessModal = memo(({ isOpen, message, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-linear-to-br from-indigo-50/60 via-white to-purple-50/60 pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-100/50 rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-100/50 rounded-full pointer-events-none" />
          <div className="relative z-10">
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
              }}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.15,
                type: "spring",
                damping: 14,
                stiffness: 260,
              }}
            >
              <motion.svg
                className="w-12 h-12 text-white"
                viewBox="0 0 28 28"
                fill="none"
              >
                <motion.path
                  d="M5 14l6 6L23 8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </motion.svg>
            </motion.div>
            <motion.h3
              className="text-3xl font-bold text-gray-900 text-center mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Message Sent!
            </motion.h3>
            <motion.p
              className="text-gray-500 text-center mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {message}
            </motion.p>
            <Button
              onClick={onClose}
              variant="indigo"
              className="w-full"
              round="xl"
            >
              Got it!
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));
SuccessModal.displayName = "SuccessModal";

// ─── memo: FloatingIcon only re-renders when delay or children change ─────────
const FloatingIcon = memo(({ children, delay = 0 }) => (
  <motion.div
    animate={floatAnimation}
    transition={floatTransition(delay)}
    style={{ willChange: "transform" }}
  >
    {children}
  </motion.div>
));
FloatingIcon.displayName = "FloatingIcon";

// ─── memo: PulseBadge has no props — renders exactly once ────────────────────
const PulseBadge = memo(() => (
  <motion.div
    className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full border border-indigo-200/60"
    style={{
      background:
        "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))",
    }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
    </span>
    <span
      className="text-indigo-700 text-sm font-semibold tracking-wide uppercase"
      style={{ letterSpacing: "0.08em" }}
    >
      Get in Touch
    </span>
  </motion.div>
));
PulseBadge.displayName = "PulseBadge";

// ─── memo: GradientIcon only re-renders when children change ─────────────────
const GradientIcon = memo(({ children }) => (
  <div
    className="p-3 rounded-xl shadow-lg shrink-0"
    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
  >
    {children}
  </div>
));
GradientIcon.displayName = "GradientIcon";

// ─── Main Contact component ──────────────────────────────────────────────────
const Contact = () => {
  const methods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { handleSubmitContact, loading, error, success, message, clearState } =
    useContact();
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const onSubmit = async (data) => {
    try {
      await handleSubmitContact(data);
    } catch {
      // Error handled by hook
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    clearState();
  };

  return (
    <>
      {/*
        Fonts loaded as <link> tags instead of CSS @import.
        @import blocks rendering; <link rel="preconnect"> + stylesheet is
        non-blocking and ~200ms faster on first load.
        Best practice: move these into your root index.html <head>.
      */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .contact-section * { font-family: 'DM Sans', sans-serif; }
        .contact-heading { font-family: 'Playfair Display', Georgia, serif; }

        .glass-card {
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 8px 40px rgba(99,102,241,0.08), 0 2px 12px rgba(0,0,0,0.06);
          transition: box-shadow 0.4s ease;
        }
        .glass-card:hover {
          box-shadow: 0 16px 60px rgba(99,102,241,0.13), 0 4px 20px rgba(0,0,0,0.08);
        }

        .contact-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1.5px solid #e5e7eb;
          transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
          resize: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          background: rgba(249,250,251,0.7);
          color: #111827;
          outline: none;
        }
        .contact-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
          background: white;
        }
        .contact-textarea.error { border-color: #f87171; }
        .contact-textarea::placeholder { color: #9ca3af; }

        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 14px 16px;
          border-radius: 16px;
          transition: background 0.25s, transform 0.25s;
          cursor: default;
        }
        .info-row:hover { background: rgba(99,102,241,0.06); transform: translateX(6px); }

        .social-btn {
          padding: 12px;
          border-radius: 14px;
          background: rgba(243,244,246,0.8);
          color: #6b7280;
          border: 1.5px solid transparent;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .social-btn:hover {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
          transform: translateY(-4px) scale(1.05);
        }

        .heading-underline {
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent);
          margin: 8px 0 24px;
        }

        /* CSS-only hover glow — no JS/layoutId needed */
        .submit-btn-glow {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
          box-shadow: 0 6px 24px rgba(99,102,241,0.4);
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .submit-btn-glow:hover {
          box-shadow: 0 10px 36px rgba(99,102,241,0.55);
          transform: translateY(-2px);
        }
        .submit-btn-glow:active { transform: translateY(0); }
      `}</style>

      <title>CDC JGEC | Contact us</title>
      <meta
        name="description"
        content="Contact with CDC JGEC team for any doubt or help"
      />

      <section
        className="contact-section min-h-screen relative overflow-hidden py-20 md:py-28 px-4 md:px-6"
        style={{
          background:
            "linear-gradient(145deg, #f8f7ff 0%, #ffffff 40%, #fdf4ff 70%, #f0f4ff 100%)",
        }}
      >
        {/* Memoized — never re-renders after mount */}
        <BackgroundShapes />

        {/* ── HEADER ── */}
        <motion.div
          className="text-center mb-20 relative z-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <PulseBadge />

          <motion.h2
            className="contact-heading text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 leading-tight"
            variants={fadeInUp}
          >
            Let's{" "}
            <span className="relative inline-block">
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Connect
              </span>
              <motion.span
                className="heading-underline"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-500 mt-5 max-w-xl mx-auto text-lg leading-relaxed"
            variants={fadeInUp}
          >
            Have questions or want to collaborate?{" "}
            <span className="text-indigo-600 font-medium">
              We'd love to hear from you.
            </span>
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {DOTS.map((i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === 2 ? 28 : i === 1 || i === 3 ? 10 : 6,
                  height: 6,
                  background:
                    i === 2
                      ? "linear-gradient(90deg, #6366f1, #a855f7)"
                      : i === 1 || i === 3
                        ? "rgba(99,102,241,0.4)"
                        : "rgba(99,102,241,0.2)",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-14 relative z-10">
          {/* ── LEFT: FORM ── */}
          <motion.div initial="hidden" animate="visible" variants={slideInLeft}>
            <div className="glass-card rounded-3xl p-7 md:p-10">
              <motion.div
                className="flex items-center gap-4 mb-2"
                variants={fadeInUp}
              >
                <GradientIcon>
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </GradientIcon>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Send Us a Message
                  </h3>
                  <p className="text-gray-400 text-sm mt-0.5">
                    We typically reply within 24 hours
                  </p>
                </div>
              </motion.div>

              <div className="section-divider" />

              <FormProvider {...methods}>
                <motion.form
                  ref={formRef}
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="space-y-5"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={fadeInUp}>
                    <Input
                      name="fullName"
                      label="Full Name"
                      placeholder="Enter your name"
                      rules={{ required: "Full Name is required" }}
                    />
                  </motion.div>

                  <motion.div variants={fadeInUp}>
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
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Input
                      name="subject"
                      label="Subject"
                      placeholder="What is this regarding?"
                      rules={{ required: "Subject is required" }}
                    />
                  </motion.div>

                  <motion.div variants={fadeInUp} className="text-left">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ letterSpacing: "0.01em" }}
                    >
                      Message
                    </label>
                    <textarea
                      {...methods.register("message", {
                        required: "Message is required",
                      })}
                      rows="5"
                      placeholder="Type your message here..."
                      className={`contact-textarea ${
                        methods.formState.errors.message ? "error" : ""
                      }`}
                    />
                    {methods.formState.errors.message && (
                      <motion.p
                        className="text-red-500 text-sm mt-2 flex items-center gap-1.5"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {methods.formState.errors.message.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {error && (
                    <motion.div
                      className="p-4 rounded-2xl flex items-center gap-3 border"
                      style={{
                        background: "rgba(254,242,242,0.9)",
                        borderColor: "rgba(252,165,165,0.6)",
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="p-2 bg-red-100 rounded-xl shrink-0">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-red-700 text-sm">{error}</p>
                    </motion.div>
                  )}

                  <motion.div variants={fadeInUp}>
                    <Button
                      type="submit"
                      variant="indigo"
                      size="lg"
                      round="xl"
                      className="submit-btn-glow w-full mt-2"
                      disabled={loading}
                    >
                      {/* Removed layoutId="buttonBackground" — caused expensive layout recalculation on every hover */}
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <motion.svg
                              className="w-5 h-5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </motion.svg>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <motion.svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={arrowAnimation}
                              transition={arrowTransition}
                              style={{ willChange: "transform" }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </motion.svg>
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </motion.form>
              </FormProvider>
            </div>
          </motion.div>

          {/* ── RIGHT: INFO + MAP ── */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={slideInRight}
          >
            {/* Contact Info Card */}
            <motion.div variants={scaleIn}>
              <div className="glass-card rounded-3xl p-7 md:p-10">
                <motion.div
                  className="flex items-center gap-4 mb-2"
                  variants={fadeInUp}
                >
                  <GradientIcon>
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </GradientIcon>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Contact Information
                    </h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      Reach us through any channel
                    </p>
                  </div>
                </motion.div>

                <div className="section-divider" />

                <motion.div
                  className="space-y-1"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="info-row" variants={fadeInUp}>
                    <FloatingIcon delay={0}>
                      <GradientIcon>
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </GradientIcon>
                    </FloatingIcon>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                        Email
                      </p>
                      <p className="text-gray-800 font-medium">
                        sm2733@it.jgec.ac.in
                      </p>
                    </div>
                  </motion.div>

                  <motion.div className="info-row" variants={fadeInUp}>
                    <FloatingIcon delay={0.5}>
                      <GradientIcon>
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                      </GradientIcon>
                    </FloatingIcon>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                        Phone
                      </p>
                      <p className="text-gray-800 font-medium">
                        +91 9832395096
                      </p>
                    </div>
                  </motion.div>

                  <motion.div className="info-row" variants={fadeInUp}>
                    <FloatingIcon delay={1}>
                      <GradientIcon>
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </GradientIcon>
                    </FloatingIcon>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
                        Address
                      </p>
                      <p className="text-gray-800 font-medium leading-snug">
                        Jalpaiguri Government Engineering College,
                        <br />
                        Jalpaiguri, 735102
                      </p>
                    </div>
                  </motion.div>

                  <motion.div className="pt-4 flex gap-3" variants={fadeInUp}>
                    {SOCIALS.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href="#"
                        className="social-btn"
                        whileHover={{ y: -5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        aria-label={social.label}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d={social.icon} />
                        </svg>
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* ── MAP CARD ── */}
            <motion.div variants={scaleIn}>
              <div className="glass-card rounded-3xl overflow-hidden">
                <div className="relative group">
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))",
                    }}
                  />
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3569.196807672892!2d88.70117917501001!3d26.545944676867652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e47bce687f169d%3A0x4152036d0d736d37!2sJalpaiguri%20Government%20Engineering%20College!5e0!3m2!1sen!2sin!4v1764883854948!5m2!1sen!2sin"
                    className="w-full h-[280px] md:h-80"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    allowFullScreen
                    title="JGEC Location"
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 rounded-2xl p-4 shadow-xl z-20"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.8)",
                    }}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-xl shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #d1fae5, #a7f3d0)",
                        }}
                      >
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">
                          Jalpaiguri Government Engineering College
                        </p>
                        <p className="text-indigo-500 text-xs font-medium mt-0.5">
                          Open in Google Maps ↗
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(248,247,255,0.8), transparent)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        />
      </section>

      <SuccessModal
        isOpen={showSuccess}
        message={
          message ||
          "Your message has been sent successfully! We'll get back to you soon."
        }
        onClose={closeSuccessModal}
      />
    </>
  );
};

export default Contact;
