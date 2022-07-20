
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const {
  EMAIL_AUTH_USER,
  EMAIL_REFRESH_TOKEN,
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET
} = require("../configs/secret");
const { waitFor } = require("../utils/time.utils");

const oauth2Client = new OAuth2(
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: EMAIL_REFRESH_TOKEN
});

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    EMAIL_CLIENT_ID,
    EMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: EMAIL_REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      accessToken,
      user: EMAIL_AUTH_USER,
      clientId: EMAIL_CLIENT_ID,
      clientSecret: EMAIL_CLIENT_SECRET,
      refreshToken: EMAIL_REFRESH_TOKEN
    }
  });
  console.log("[MAIL] Created transport");

  return transporter;
};

let transport;

async function setupTransport() {
  transport = await createTransporter()
    .catch(e => console.log("Cannot setup mail service: ", e));
}
setupTransport();

/*
var mailOptions = {
  from: 'sender@mail.mail',
  to: 'receiver@mail.mail',
  subject: 'Sending Email using Node.js[nodemailer]',
  text: 'This is the text'
};
*/

async function sendMail(options, retries=3) {
  for(let i = 0; i < retries; ++i) {
    try {
      const result = await transport.sendMail(options);
      return result;
    } catch (e) {
      console.log("mail service error: ", e);
    }
    await waitFor(500);
  }

  return false;
}

exports.sendMail = sendMail;
