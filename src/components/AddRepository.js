import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { useSetRecoilState, useRecoilState } from "recoil";
import { currentUser, repositoryList } from "../store";

const query = `{
    viewer {
      repositories(last: 10) {
        nodes {
          nameWithOwner
          owner {
            login
          }
        }
      }
    }
  }
  `;

function getCookieValue(a) {
  var b = document.cookie.match("(^|;)\\s*" + a + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}
const jwt = getCookieValue("jwt");
const AddRepository = () => {
  const user = useRecoilState(currentUser);
  useEffect(() => {
    console.log(user[0].access_token);
    const fetchData = async () => {
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user[0].access_token}`,
        },
        body: JSON.stringify({
          query: query,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };
    fetchData();
  }, []);
  return (
    <div>
      <Button onClick={console.log("hi")}>View Repos</Button>
    </div>
  );
};

export default AddRepository;
