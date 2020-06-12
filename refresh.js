var request = require("request");

var options = {
  method: "POST",
  url: "https://github.com/login/oauth/access_token",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  form: {
    grant_type: "refresh_token",
    client_id: "Iv1.ee5bc6912a163e42",
    client_secret: "55d30b87cbc276aa561c0f8443ed9994b240565a",
    refresh_token:
      "r1.816209088b5a3285517828b65bcacb404f9e0a522ab156da3ab3be4bb1588a30a849139dab3b8e12",
  },
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);
  console.log(response);
  console.log(body);
});
(?<=access_token=)(.*)(?=&expires)
(?<=refresh_token=)(.*)(?=&refresh)
const accessTokenRegExp = /(?<=access_token=)(.*)(?=&expires)/;
var str =
  "access_token=128425536f3770c4814942521bf4bb5743a1b90e&expires_in=28800&refresh_token=r1.91c717f697c8cfcd181f352b19892106d3b3a48ff553ff204283d5b433d9bf5d7240d9deda17edf3&refresh_token_expires_in=15811200&scope=&token_type=bearer";

var result = accessTokenRegExp.exec(str);
console.log(result[0]);
