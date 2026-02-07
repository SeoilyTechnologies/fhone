const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abhay.seoily@gmail.com",       // your email
    pass: "yijv fekx gplc apiu",   // Gmail App Password
  },
});

/**
 * Send OTP email template
 */
async function sendOtpEmail(to, otp) {
  const htmlTemplate = `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Email</title>
</head>

<style>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
</style>

<body style="margin:0; padding:0; background:#ffffff; font-family: Urbanist, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; margin:0 auto; background:radial-gradient( circle at center, #fbd9a2 0%, #f3b15e 30%,
    #e58a2a 60%, #d36a1c 85%, #c45a14 100%); box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); ">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="https://mobilemandirapp.com/images/logo-english-white.png" alt="Logo" width="100" style="display:block;">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px;">
              <img src="otp.jpg" alt="" width="200" style="display:block; max-width:100%; height:auto;">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px; color: #fff; font-size: 20px; font-weight: bold;">
              Your One-Time Password (OTP)
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 30px; font-size: 15px; line-height: 24px; color: #fff;">
             This code is valid for a limited time <br>and should not be shared with anyone. If you did not <br>request this, please ignore this message.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0 10px 0; font-size: 16px; font-weight: bold; color: #fff;">
              OTP
            </td>
          </tr>
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 50px;">
                <tr>
                  <td align="center" bgcolor="#000" style="border-radius: 4px; padding: 12px 24px; color: #ffffff; font-size: 18px; font-weight: bold;">
                     ${otp}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <!-- App Download Links -->
          <tr>
            <td align="center" style="padding: 40px 20px 20px; background-color: #fff;">
              <a href="#" style="margin:0 10px;"><img src="https://mobilemandirapp.com/images/google-play.webp" alt="Download on Google Play" width="150" style="vertical-align:middle;"></a>
              <a href="#" style="margin:0 10px;"><img src="https://mobilemandirapp.com/images/app-store.webp" alt="Download on the App Store" width="150" style="vertical-align:middle;"></a>
            </td>
          </tr>
          <!-- <tr>
            <td align="center" style="padding: 10px 20px; background-color: #fff;">
              <a href="https://www.facebook.com/MobileMandirApp" style="margin:0 5px;"><img src="images/facebook.png" alt="Facebook" width="24" style="vertical-align:middle;"></a>
              <a href="https://www.instagram.com/mobilemandirapp/" style="margin:0 5px;"><img src="images/instagram.png" alt="Instagram" width="24" style="vertical-align:middle;"></a>
              <a href="https://www.linkedin.com/company/mobilemandirapp" style="margin:0 5px;"><img src="images/linkedin.png" alt="LinkedIn" width="24" style="vertical-align:middle;"></a>
              <a href="https://www.youtube.com/@MobileMandirApp" style="margin:0 5px;"><img src="images/youtube.png" alt="youtube" width="24" style="vertical-align:middle;"></a>
            </td>
          </tr> -->
          <tr>
            <td align="center" style="padding: 10px 20px 40px; background-color: #fff; color: #000; font-size: 13px;">
      
             🌐 <a href="https://mobilemandirapp.com/" target="_blank" style="color:#000; text-decoration:none;">https://mobilemandirapp.com/</a> &nbsp; | &nbsp;  
              <a href="https://www.facebook.com/MobileMandirApp" target="_blank" style="margin:0 5px;"><img src="https://mobilemandirapp.com/images/facebook.png" alt="Facebook" width="24" style="vertical-align:middle;"></a>
              <a href="https://www.instagram.com/mobilemandirapp/" target="_blank" style="margin:0 5px;"><img src="https://mobilemandirapp.com/images/instagram.png" alt="Instagram" width="24" style="vertical-align:middle;"></a>
              <a href="https://www.linkedin.com/company/mobilemandirapp" target="_blank" style="margin:0 5px;"><img src="https://mobilemandirapp.com/images/linkedin.png" alt="LinkedIn" width="24" style="vertical-align:middle;"></a>
              <a href="https://www.youtube.com/@MobileMandirApp" target="_blank" style="margin:0 5px;"><img src="https://mobilemandirapp.com/images/youtube.png" alt="youtube" width="24" style="vertical-align:middle;"></a>
        
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Your App" Test`,
    to,
    subject: "Your OTP Code",
    html: htmlTemplate,
  });
}

module.exports = sendOtpEmail;
