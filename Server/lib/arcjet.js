import arcjet, { shield, tokenBucket } from "@arcjet/node";
import "../Config/Envfiles.config";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 20,
      interval: 5,
      capacity: 20,
    }),
  ],
});
