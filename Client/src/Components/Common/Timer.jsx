import React, { useEffect, useState } from "react";
import { AnimatedDigit } from "../index";

/**
 * CountdownTimer
 *
 * @param {number} targetTime - future timestamp in milliseconds
 * @param {function} onComplete - callback when countdown reaches 0
 * @param {boolean} showHours - whether to show hours (default true)
 */
const CountdownTimer = ({ targetTime, onComplete, showHours = true }) => {
  const calculateTimeLeft = () =>
    Math.max(0, Math.floor((targetTime - Date.now()) / 1000));

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hrs: hrs.toString().padStart(2, "0"),
      mins: mins.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  const { hrs, mins, secs } = formatTime(timeLeft);

  const renderDigits = (value) =>
    value
      .split("")
      .map((digit, i) => <AnimatedDigit key={`${digit}-${i}`} value={digit} />);

  return (
    <div className="flex items-center justify-center gap-2 text-white">
      {showHours && (
        <>
          <div className="flex gap-1">{renderDigits(hrs)}</div>
          <span className="text-3xl font-bold">:</span>
        </>
      )}

      <div className="flex gap-1">{renderDigits(mins)}</div>
      <span className="text-3xl font-bold">:</span>
      <div className="flex gap-1">{renderDigits(secs)}</div>
    </div>
  );
};

export default CountdownTimer;
