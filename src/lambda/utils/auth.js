const { sign } = require(`jsonwebtoken`);
const GitHubStrategy = require(`passport-github`).Strategy;
const passport = require(`passport`);
const passportJwt = require(`passport-jwt`);
const refresh = require("passport-oauth2-refresh");

require(`isomorphic-fetch`);

const {
  BASE_URL,
  ENDPOINT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  HASURA_ENDPOINT,
  // eslint-disable-next-line comma-dangle
  HASURA_SECRET,
} = require(`./config`);

function authJwt(jwt) {
  return sign(jwt, HASURA_SECRET);
}

// eslint-disable-next-line no-console

const strategy = new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${BASE_URL}${ENDPOINT}/auth/github/callback`,
    scope: ["public_repo", "user"],
  },
  async (accessToken, refreshToken, profile, done) => {
    fetch(`${HASURA_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": `${process.env.HASURA_SECRET}`,
      },
      body: JSON.stringify({
        query: `query {
          users(where: {github_user_id: {_eq: ${profile.id}}}) {
            access_token
            email
            github_user_id
            id
            login
            node_id
            refresh_token
          }
        }
        `,
      }),
    })
      // eslint-disable-next-line arrow-parens
      .then((res) => res.json())
      .then((res) => {
        if (res.data.users[0] !== undefined) {
          const claims = {
            sub: "" + res.data.users[0].id,
            login: "" + profile._json.login,
            access_token: accessToken,
            refresh_token: refreshToken,
            "https://hasura.io/jwt/claims": {
              "x-hasura-default-role": "user",
              "x-hasura-user-id": "" + res.data.users[0].id,
              "x-hasura-allowed-roles": ["user"],
            },
          };

          const jwt = authJwt(claims);
          const user = {
            id: res.data.users[0].id,
            userName: res.data.users[0].name,
          };

          // req.user = user;

          const id = user.id;
          const username = user.userName;
          return done(null, { id, username, accessToken, refreshToken, jwt });
        } else {
          const query = `mutation ($access_token: String, $email: String , $github_user_id: Int, $login: String, $node_id: String, $refresh_token: String) {
              insert_users_one(object: {access_token: $access_token, email: $email, github_user_id: $github_user_id, login: $login, node_id: $node_id, refresh_token: $refresh_token}) {
                access_token
                email
                github_user_id
                id
                login
                node_id
                refresh_token
              }
            }
            
             `;
          const variables = {
            github_user_id: profile._json.id,
            email: profile._json.email,
            login: profile._json.login,
            node_id: profile._json.node_id,
            access_token: accessToken,
            refresh_token: refreshToken,
          };

          fetch("https://code-accel-backend.herokuapp.com/v1/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": "i30LbO4dZlwjW95R8cP+D8hZ2OktZSMN",
            },
            body: JSON.stringify({
              query,
              variables,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              const claims = {
                sub: "" + res.data.insert_users_one.id,
                login: "" + profile._json.login,
                access_token: accessToken,
                refresh_token: refreshToken,
                "https://hasura.io/jwt/claims": {
                  "x-hasura-default-role": "user",
                  "x-hasura-user-id": "" + res.data.insert_users_one.id,
                  "x-hasura-allowed-roles": ["user"],
                },
              };
              const jwt = authJwt(claims);
              const user = {
                id: res.data.insert_users_one.id,
                userName: res.data.insert_users_one.login,
              };

              // req.user = user;

              const id = user.id;
              const username = user.userName;
              return done(null, {
                id,
                username,
                accessToken,
                refreshToken,
                jwt,
              });
            });
        }
      });
  }
);
passport.use(strategy);
refresh.use(strategy);

passport.use(
  new passportJwt.Strategy(
    {
      jwtFromRequest(req) {
        if (!req.cookies) throw new Error(`Missing cookie-parser middleware`);
        return req.cookies.jwt;
      },
      secretOrKey: HASURA_SECRET,
    },
    async (req, done) => {
      try {
        const ijwt = authJwt(req);
        const id = req.sub;
        const username = req.login;
        const accessToken = req.access_token;
        const refreshToken = req.refresh_token;
        return done(null, { id, username, accessToken, refreshToken, ijwt });
      } catch (error) {
        return done(error);
      }
    }
  )
);
