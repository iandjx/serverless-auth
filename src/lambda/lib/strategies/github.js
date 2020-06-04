import { Router } from "express";
import passport from "passport";
import { Strategy } from "passport-github";
require("isomorphic-fetch");
const jwt = require("jsonwebtoken");

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
        async function(req, accessToken, refreshToken, profile, done) {
          fetch("https://hasura-jwt-oauth-prac.herokuapp.com/v1/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": `${process.env.HASURA_SECRET}`,
            },
            body: JSON.stringify({
              query: `query {
              users(where: {github_user_id: {_eq: ${profile.id}}}) {
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
              // console.log(res.data.users[0].id !== undefined);
              // console.info("load user profile", profile);
              if (res.data.users[0] !== undefined) {
                const claims = {
                  sub: "" + res.data.users[0].id,
                  "https://hasura.io/jwt/claims": {
                    "x-hasura-default-role": "admin",
                    "x-hasura-user-id": "" + res.data.users[0].id,
                    "x-hasura-allowed-roles": ["admin", "user"],
                  },
                };

                const token = jwt.sign(claims, process.env.HASURA_SECRET);
                const user = {
                  id: res.data.users[0].id,
                  token: token,
                  userName: res.data.users[0].name,
                };

                req.user = user;
                return done(null, user);
              } else {
                const query = `mutation (
                  $github_user_id: Int!
                  $name: String!
                  $bio: String
                  $pubic_repos: Int!
                  $public_gists: Int!
                  $access_token: String
                  $refresh_token: String
                ) {
                  insert_users(objects: {
                  name: $name, 
                  public_gists: $public_gists, 
                  public_repos: $pubic_repos, 
                  refresh_token: $refresh_token, 
                  github_user_id: $github_user_id, 
                  bio: $bio, 
                  access_token: $access_token}) {
                    returning {
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
                }
                 `;
                const variables = {
                  github_user_id: profile._json.id,
                  name: profile._json.name,
                  bio: profile._json.bio,
                  pubic_repos: profile._json.public_repos,
                  public_gists: profile._json.public_gists,
                  access_token: accessToken,
                  refresh_token: refreshToken,
                };
                fetch(
                  "https://hasura-jwt-oauth-prac.herokuapp.com/v1/graphql",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "x-hasura-admin-secret":
                        "i30LbO4dZlwjW95R8cP+D8hZ2OktZSMN",
                    },
                    body: JSON.stringify({
                      query,
                      variables,
                    }),
                  }
                )
                  .then((res) => res.json())
                  .then((res) => {
                    console.log(res.data.insert_users);

                    const claims = {
                      sub: "" + res.data.insert_users.returning.id,
                      "https://hasura.io/jwt/claims": {
                        "x-hasura-default-role": "admin",
                        "x-hasura-user-id":
                          "" + res.data.insert_users.returning.id,
                        "x-hasura-allowed-roles": ["admin", "user"],
                      },
                    };
                    const token = jwt.sign(claims, process.env.HASURA_SECRET);
                    const user = {
                      id: res.data.insert_users.returning.id,
                      token: token,
                      userName: res.data.insert_users.returning.name,
                    };
                    console.log(user);

                    req.user = user;
                    return done(null, user);
                  });
              }
            });
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
    console.log(req);
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
