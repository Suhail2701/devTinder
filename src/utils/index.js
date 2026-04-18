const nodemailer = require("nodemailer");

const sendResetEmail = (userEmail, rawToken) => {

   try
   {
         const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "tinder.dev.app@gmail.com",
            pass: "sxojefeiyvbcpwoq"  //App Password you have generate it from your google account
        }
    });

    const resetURL = `http://localhost:3000/profile/reset-password?token=${rawToken}`;

    const mailOptions = {
        from: "tinder.dev.app@gmail.com",
        to: userEmail,
        subject: "tinder.dev.app@gmail.com",
        html: `
            <h3>Password Reset</h3>
            <p>You requested to reset a password</p>
            <p>Click the link below</p>
            <a href=${resetURL}>${resetURL}</a>
            <p>This link will expire in 15 minutes.</p>
            <p>If you did not request this, ignore this email.</p>
        `
    };

    transporter.sendMail(mailOptions);
   }
   catch(error)
   {
        res.status(400).send("Error: " + error);
   }
}

module.exports = sendResetEmail;