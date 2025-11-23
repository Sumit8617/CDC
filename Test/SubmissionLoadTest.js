import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 50, // 50 virtual users
  duration: "30s", // run for 30 seconds
};

export default function () {
  const url = "http://localhost:5000/api/v1/user/submit-contest";

  const payload = JSON.stringify({
    contest: "69216745858d625a1974b01c", // Replace with real contest ID
    user: "691dd13c4d58d64d23a10b32", // Replace with real user ID
    questions: [
      { question: "69216745858d625a1974b011", submittedOption: 2 },
      { question: "69216745858d625a1974b012", submittedOption: 4 },
      { question: "69216745858d625a1974b013", submittedOption: 1 },
    ],
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(0.1); // prevent too much hammering
}
