import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { useSetRecoilState, useRecoilState } from "recoil";
import { currentUser, repositoryList, userRepoList } from "../store";
import TextField from "@material-ui/core/TextField";
import { GraphQLClient } from "graphql-request";
import { useSubscriptions, useSubscription } from "graphql-hooks";

const TOPIC_SUBSCRIPTION = `
    subscription MySubscription {
    topics {
      id
      name
    }
  }
  `;

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
const endpoint = `https://api.github.com/graphql`;

function getCookieValue(a) {
  var b = document.cookie.match("(^|;)\\s*" + a + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}
const jwt = getCookieValue("jwt");
const AddRepository = () => {
  const [topic, setTopic] = useState([]);
  const [error, setError] = useState(null);

  const topic1 = useSubscription(
    { query: TOPIC_SUBSCRIPTION },
    ({ data, errors }) => {
      if (errors && errors.length > 0) {
        // handle your errors
        setError(errors[0]);
        return;
      }
      setTopic([...data]);
    }
  );

  const user = useRecoilState(currentUser);
  const [repoSearchString, setRepoSearchString] = useState("");
  const setUserRepoList = useSetRecoilState(userRepoList);
  const userRepositoryList = useRecoilState(userRepoList);
  const searchQuery = `{
    search(query: " ${repoSearchString} user:iandjx", type: REPOSITORY, first: 50) {
      edges {
        node {
          ... on Repository {
            name
            repositoryTopics(first: 10) {
              nodes {
                topic {
                  name
                }
              }
            }
            owner {
              login
              url
              id
            }
            languages(first: 10) {
              nodes {
                name
              }
            }
            description
            id
          }
        }
      }
    }
  }
  `;

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${user[0].access_token}`,
    },
  });

  console.log(JSON.stringify(graphQLClient));
  const handleClick = async () => {
    const data = await graphQLClient.request(searchQuery);
    console.log(data);
    setUserRepoList(data);
  };
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
      {/* {userRepositoryList[0].search &&
        console.log(userRepositoryList[0].search.edges[0].node.name)} */}
      <TextField
        id="standard-basic"
        value={repoSearchString}
        onChange={(e) => setRepoSearchString(e.target.value)}
        label="Standard"
      />

      <Button
        onClick={() => {
          handleClick();
        }}
      >
        Search
      </Button>
      {console.log(userRepositoryList)}
      {userRepositoryList[0].search !== undefined ? (
        userRepositoryList[0].search.edges.map((node) => (
          <React.Fragment>
            <p key={node.node.id}>{node.node.name}</p>
            <Button onClick={() => console.log(node.node.name)}>
              {" "}
              Connect
            </Button>
          </React.Fragment>
        ))
      ) : (
        <div />
      )}
      {console.log(topic)}
    </div>
  );
};

export default AddRepository;
