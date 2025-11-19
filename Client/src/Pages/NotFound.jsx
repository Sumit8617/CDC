/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "../Components/index";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 px-6 py-12">
      {/* Main Card Wrapper */}
      <Card
        variant="default"
        round="lg"
        padding="p-8 md:p-12"
        className="max-w-5xl w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-2xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 w-full">
          {/* LEFT SECTION */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white"
            >
              404
              <span className="block text-5xl font-bold text-slate-500 dark:text-slate-300 mt-2">
                Page NOT FOUND
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="mt-6 text-slate-600 dark:text-slate-300 max-w-xl"
            >
              The page you are looking for might have been moved, renamed, or
              might never have existed. Try returning home or contact support if
              you think this is an error.
            </motion.p>

            {/* Button Group */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3"
            >
              {/* HOME BUTTON */}
              <Button
                variant="blue"
                size="md"
                round="sm"
                className="shadow-md"
                onClick={() => navigate("/")}
              >
                Go Home
              </Button>

              {/* SUPPORT BUTTON */}
              <Button
                variant="outline"
                size="md"
                round="sm"
                className="border-slate-300 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() =>
                  window.location.replace("mailto:support@example.com")
                }
              >
                Contact Support
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.24 }}
              className="mt-6 text-sm text-slate-500 dark:text-slate-400"
            >
              Tip: Check the URL for typos or use the navigation menu to find
              what you're after.
            </motion.div>
          </div>

          {/* RIGHT SECTION — SVG ILLUSTRATION */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 14,
                delay: 0.08,
              }}
              className="w-full max-w-sm"
            >
              <svg
                viewBox="0 0 600 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#C7E9FF" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#E6F6FF" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                <rect
                  x="0"
                  y="60"
                  width="600"
                  height="260"
                  rx="24"
                  fill="url(#g1)"
                />

                <motion.circle
                  cx="150"
                  cy="160"
                  r="36"
                  fill="#fff"
                  initial={{ y: 0 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.circle
                  cx="420"
                  cy="120"
                  r="52"
                  fill="#F1F8FF"
                  initial={{ y: 0 }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <motion.g
                  initial={{ x: 0 }}
                  animate={{ x: [-6, 6, -6] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <rect
                    x="260"
                    y="200"
                    width="140"
                    height="70"
                    rx="12"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                  <rect
                    x="278"
                    y="220"
                    width="28"
                    height="10"
                    rx="3"
                    fill="#E6F2FF"
                  />
                  <rect
                    x="314"
                    y="220"
                    width="60"
                    height="10"
                    rx="3"
                    fill="#E6F2FF"
                  />
                </motion.g>

                <text
                  x="300"
                  y="280"
                  textAnchor="middle"
                  fontSize="72"
                  fontWeight="700"
                  fill="#8AA6BD"
                  opacity="0.95"
                >
                  404
                </text>
              </svg>
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}
