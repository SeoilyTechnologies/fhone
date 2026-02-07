const axios = require("axios");

const sendOtpSms = async (phone, otp, retryCount = 0) => {
  const message =
    `Dear user, your OTP for MOBILE MANDIR APP is ${otp}. ` +
    `Please do not share it with anyone. It is valid for 10 minutes.`;

  try {
    const response = await axios.post(
      "http://sms.digitalnexk.com/sendsms_v2.0/sendsms.php",
      null,
      {
        timeout: 7000, // ⏱️ 7 sec max wait
        params: {
          username: "seoily",
          password: "Shailesh@2",
          type: "TEXT",
          sender: "SEOILY",
          mobile: phone,
          message: message,
        },
      }
    );

    console.log("✅ SMS API response:", response.data);
    return true;

  } catch (error) {
    console.error("❌ SMS error:", error.message);

    // 🔁 Retry ONLY ONCE
    if (retryCount < 1) {
      console.log("🔁 Retrying SMS...");
      return sendOtpSms(phone, otp, retryCount + 1);
    }

    return false; // ❗ important
  }
};

module.exports = sendOtpSms;
