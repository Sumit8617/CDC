import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 10, // number of virtual users
  duration: "60s", // test duration
};

// Base user templates
const baseUsers = [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }];

export default function () {
  // Pick a random base user
  const baseUser = baseUsers[Math.floor(Math.random() * baseUsers.length)];

  // Generate unique email and mobile number for each request
  const timestamp = Date.now(); // milliseconds since epoch
  const randomSuffix = Math.floor(Math.random() * 1000); // small random number

  const user = {
    name: baseUser.name,
    email: `${baseUser.name.toLowerCase()}${timestamp}${randomSuffix}@it.jgec.ac.in`,
    password: "12345678",
    mobileNumber: (
      1000000000 +
      (timestamp % 9000000000) +
      randomSuffix
    ).toString(),
  };

  console.log(
    "Created Mobile Number:",
    user.mobileNumber,
    "Email:",
    user.email
  );

  const payload = JSON.stringify(user);

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = http.post(
    "http://localhost:5000/api/v1/user/signup",
    payload,
    params
  );
  console.log(res.status, res.body);

  sleep(1);
}
