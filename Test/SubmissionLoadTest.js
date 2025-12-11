import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 5, // 50 virtual users
  duration: "30s", // run for 30 seconds
};

export default function () {
  const url = "http://localhost:5000/api/v1/user/submit-contest";

  const payload = JSON.stringify({
    contest: "692fe4d9a9b4f02f46f0378c", // Replace with real contest ID
    user: "693a830f590d662d2fc9ac28", // Replace with real user ID
    questions: [
      { question: "692fe4d9a9b4f02f46f03781", submittedOption: 1 },
      { question: "692fe4d9a9b4f02f46f03782", submittedOption: 3 },
      { question: "692fe4d9a9b4f02f46f03783", submittedOption: 1 },
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
