//TODO refactor to use selectors when needed

import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import {
  currentUser,
  userRepoList,
  hasuraTopicList,
  fetchUserDetails,
} from "../store";
import TextField from "@material-ui/core/TextField";
import { GraphQLClient } from "graphql-request";
import {
  repoSearchQuery,
  fetchAllTopics,
  createNewRepo,
  insertNewTopic,
  addREpoTopics,
} from "../queries/index";
import { useQuery, useMutation } from "graphql-hooks";

const endpoint = `https://api.github.com/graphql`;

const AddRepository = () => {
  const user = useRecoilValue(fetchUserDetails);
  const [repoSearchString, setRepoSearchString] = useState("");
  const topicList = useRecoilState(hasuraTopicList);
  const setTopicList = useSetRecoilState(hasuraTopicList);
  const setUserRepoList = useSetRecoilState(userRepoList);
  const userRepositoryList = useRecoilState(userRepoList);

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${user.access_token}`,
    },
  });

  const { loading, data, error } = useQuery(fetchAllTopics);

  const handleClick = async () => {
    const variables = {
      search_string: repoSearchString + ` user:${user.username}`,
    };
    const data = await graphQLClient.request(repoSearchQuery, variables);
    setUserRepoList(data);
  };

  const [addNewRepo] = useMutation(createNewRepo);
  const [addNewTopics] = useMutation(insertNewTopic);
  const [linkRepoTopic] = useMutation(addREpoTopics);

  const insertRepository = (repo) => {
    //compare exising topics from current repo
    const repoTopics = repo.repositoryTopics.nodes.reduce((acc, node) => {
      acc.push({ id: node.topic.id, name: node.topic.name });
      return acc;
    }, []);

    const existingTopics = repoTopics.filter((topic) =>
      topicList[0].topics.some((htopic) => htopic.id === topic.id)
    );
    let topicsToInsert;
    if (existingTopics.length === 0) {
      topicsToInsert = [...repoTopics];
    } else {
      topicsToInsert = repoTopics.filter((topic) =>
        existingTopics.some((etopic) => etopic.id !== topic.id)
      );
    }

    //add new repo
    addNewRepo({
      variables: {
        description: repo.description,
        id: repo.id,
        language: repo.primaryLanguage.name,
        name: repo.name.toLowerCase(),
        owner: repo.owner.login,
        owner_id: user.id,
        owner_node_id: repo.owner.id,
        url: repo.url,
      },
    }).then((_res) => console.log("hello this works"));

    if (topicsToInsert.length > 0) {
      addNewTopics({ variables: { objects: [...topicsToInsert] } });
    }
    const repoTopicVariables = repoTopics.map((topic) => {
      return { repository_id: repo.id, topic_id: topic.id };
    });

    linkRepoTopic({ variables: { objects: [...repoTopicVariables] } });
  };

  useEffect(() => {
    setTopicList(data);
  }, [data]);
  return (
    <div>
      {data && <p>{JSON.stringify(data)}</p>}
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

      {userRepositoryList[0].search !== undefined ? (
        userRepositoryList[0].search.edges.map((repo) => (
          <React.Fragment>
            <p key={repo.node.id}>{repo.node.name}</p>
            <Button onClick={() => insertRepository(repo.node)}>Connect</Button>
          </React.Fragment>
        ))
      ) : (
        <div />
      )}
    </div>
  );
};

export default AddRepository;
