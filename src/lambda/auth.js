const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);
const express = require(`express`);
const passport = require(`passport`);
const serverless = require(`serverless-http`);

require(`./utils/auth`);
require(`isomorphic-fetch`);

const { COOKIE_SECURE, ENDPOINT } = require(`./utils/config`);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

const handleCallback = () => (req, res) => {
  res
    .cookie(`jwt`, req.user.jwt, { httpOnly: false, COOKIE_SECURE })
    .redirect(`/repositoryList`);
};

const handleAccesstokenFailure = () => (req, res) => {
  res.redirect(`${ENDPOINT}/auth/github`);
};

app.get(
  `${ENDPOINT}/auth/github`,
  passport.authenticate(`github`, { session: false })
);
app.get(
  `${ENDPOINT}/auth/github/callback`,
  passport.authenticate(`github`, { failureRedirect: `/`, session: false }),
  handleCallback()
);

app.get(
  `${ENDPOINT}/auth/status`,
  passport.authenticate(`jwt`, { session: false }),
  (req, res) => {
    fetch("https://api.github.com/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    }).then((response) => {
      if (response.status !== 200) {
        console.log("access token failure");
        res.json({ token: false });
      } else {
        res.json({
          id: req.user.id,
          username: req.user.username,
          access_token: req.user.accessToken,
        });
      }
    });

    //check if access token is still valid
    //if valid just return access token
    // if invalid refresh access token and refresh token
    // st
  }
);

module.exports.handler = serverless(app);
