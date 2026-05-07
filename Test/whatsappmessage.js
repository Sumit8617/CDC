const axios = require("axios");

const ACCESS_TOKEN =
  "EAASYJrwi2c8BRF6mwK0kTZCxHZB9apOZAuwERFt5xZAAH4fzvNVd22R2ixl1MYHPGZBZAAVGa8kiqlKiPBOUdTES7Psrla6ZCa8ROwkBTtftOZB4Y2ovv5vGM9XQQZB1ekT1BZB5YaldwLLLunjPaeumpoPe542NKRrl5jZCmNMDlyl0bjkZBabq6jSvXmo3fE0YRJLFa7cr5ZCli95Dtz14ntK3oxZBdZBVtZCXdMW3DV7GxjHZAno05kpEoYB31m2XkPLPFJ1H1udENjbjWKY5BZBudJ6ljildDNco5z2e3yOumMDwZDZD";
const PHONE_NUMBER_ID = "1107906545730898";

async function sendWhatsAppMessage() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: "919832395096", // e.g. "919876543210"
        type: "text",
        text: {
          body: "Hello 👋, this is a test message from Node.js!",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Message sent:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

sendWhatsAppMessage();
