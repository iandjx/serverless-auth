import { Router } from "express";
import passport from "passport";
import { Strategy } from "passport-github";
require("isomorphic-fetch");

const router = Router();

router.use((req, _res, next) => {
  const {
    query: { host },
  } = req;

  // Note: Netlify functions don't have the host url, so we need to pass it explicitly
  if (!passport._strategy(Strategy.name) && host) {
    console.info(`Init Github Auth strategy on host ${host}`);

    passport.use(
      new Strategy(
        {
          clientID: process.env.GITHUB_AUTH_CLIENT_ID,
          clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
          callbackURL: `${host}/.netlify/functions/auth/github/callback`,
          passReqToCallback: true,
        },
        async function(req, _token, _tokenSecret, profile, done) {
          // let user = {};

          fetch("https://hasura-jwt-oauth-prac.herokuapp.com/v1/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": "i30LbO4dZlwjW95R8cP+D8hZ2OktZSMN",
            },
            body: JSON.stringify({
              query: `query {
              users(where: {github_user_id: {_eq: 36833562}}) {
                access_token
                bio
                github_user_id
                id
                name
                public_gists
                public_repos
                refresh_token
              }
            }
            `,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              user.id = res.data.users[0].id;
              return console.log(res.data);
            })
            .catch((error) => console.log(error));

          const user = {
            id: profile.id,
            name: profile._json.name,
          };

          req.user = user;
          return done(null, user);
        }
      )
    );
  }
  next();
});

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["profile", "repo"],
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function callback(req, res) {
    console.info(`login user ${req.user && req.user.id} and redirect`);

    return req.login(req.user, async function callbackLogin(loginErr) {
      if (loginErr) {
        throw loginErr;
      }
      return res.redirect("/");
    });
  }
);

export default router;
