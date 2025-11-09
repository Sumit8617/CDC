import React, { useEffect, useState } from "react";
import { Card } from "../index";
import { Star } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Priya Singh",
    university: "IIT Delhi",
    text: "AptiQuest helped me prepare for my placements. The contests are challenging and the progress tracking is amazing!",
  },
  {
    name: "Arjun Patel",
    university: "BITS Pilani",
    text: "I love competing with friends on the leaderboard. The platform has made aptitude practice fun and engaging.",
  },
  {
    name: "Neha Verma",
    university: "Delhi University",
    text: "The analytics dashboard shows exactly where I need to improve. Highly recommended for all students!",
  },
  {
    name: "Rahul Mehta",
    university: "IIT Bombay",
    text: "Amazing experience! The leaderboard and analytics made learning interactive and exciting.",
  },
  {
    name: "Sneha Sharma",
    university: "NIT Trichy",
    text: "This platform keeps me motivated! The contests are fun, and the competition helps me push my limits.",
  },
  {
    name: "Sneha Sharma",
    university: "NIT Trichy",
    text: "This platform keeps me motivated! The contests are fun, and the competition helps me push my limits.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // ✅ Detect screen size and set visible cards dynamically
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640)
        setVisibleCards(1); // mobile
      else if (window.innerWidth < 1024)
        setVisibleCards(2); // tablet
      else setVisibleCards(4); // desktop
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // ✅ Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= testimonials.length - visibleCards ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [visibleCards]);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center overflow-hidden">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-popins">
          Loved by Students
        </h2>
        <p className="text-gray-500 mt-3 text-lg">
          See what students are saying about {import.meta.env.VITE_APP_NAME}
        </p>

        {/* Carousel */}
        <div className="relative mt-16">
          <motion.div
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            animate={{
              x: `-${currentIndex * (100 / visibleCards)}%`,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="min-w-full sm:min-w-[50%] lg:min-w-[25%] flex justify-center"
              >
                <Card
                  height="auto"
                  width="20"
                  className="w-full max-w-sm mx-auto"
                  description={t.text}
                  footer={
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <p className="text-gray-500 text-sm">{t.university}</p>
                      </div>
                    </div>
                  }
                >
                  <div className="flex justify-center mb-3">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="text-yellow-400 fill-yellow-400 w-5 h-5"
                        />
                      ))}
                  </div>
                </Card>
              </div>
            ))}
          </motion.div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials
              .slice(0, testimonials.length - visibleCards + 1)
              .map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentIndex ? "bg-indigo-600 w-5" : "bg-gray-300"
                  }`}
                ></button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
