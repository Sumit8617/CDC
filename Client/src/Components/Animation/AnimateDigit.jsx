import { motion, AnimatePresence } from "framer-motion";

function AnimatedDigit({ value }) {
  return (
    <div className="relative w-12 h-14 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center
                     rounded-lg bg-white/20 text-3xl font-mono font-bold"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default AnimatedDigit;
