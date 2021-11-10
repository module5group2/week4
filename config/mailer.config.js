const nodemailer = require("nodemailer");

const email = process.env.EMAIL_ACCOUNT;
const password = process.env.EMAIL_PASSWORD;
const host = process.env.HOST;
const port = process.env.PORT;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: email,
    pass: password,
  },
});


module.exports.sendValidationMail = (user) => {
  transporter.sendMail({
    from: `${email}`, // sender address
    to: user.email, // list of receivers
    subject: "Welcome to PosterApp!", // Subject line
    text: "Let's activate your account", // plain text body
    html: `<div style='border: solid #3c6e71;border-radius: 3px; width: 100%;height: 44px; background-color: #ffffff; color: #353535'>
              <h3 style='text-align:center'><b>Welcome to PosterApp!</b></h3>
              <p style='text-align:center'>Please click <a href='${host}:${port}/api/users/${user.id}/activate'>here</a> to activate your account.</p>
            </div>
             `, // html body
  })
    .then(console.log)
    .catch(console.error);


};