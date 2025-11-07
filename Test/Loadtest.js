import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 5,
  duration: "10s",
};

export default function () {
  const payload = JSON.stringify({
    name: "Test User",
    email: `test${Math.random()}@it.jgec.ac.in`,
    password: "12345678",
    mobileNumber: Math.floor(1000000000 + Math.random() * 9000000000),
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    "http://localhost:5000/api/v1/user/signup",
    payload,
    params
  );
  console.log(res.status, res.body);
  sleep(1);
}
