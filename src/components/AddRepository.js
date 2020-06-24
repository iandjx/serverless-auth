//TODO refactor to use selectors when needed

import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import {
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import {
  userRepoList,
  hasuraTopicList,
  fetchUserDetails,
  fetchRepoList,
  forceTodoUpdate,
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
import { useHistory } from "react-router-dom";

const endpoint = `https://api.github.com/graphql`;

const AddRepository = () => {
  const history = useHistory();

  const user = useRecoilValue(fetchUserDetails);
  const { repositories } = useRecoilValue(fetchRepoList);
  const [repoSearchString, setRepoSearchString] = useState("");
  const topicList = useRecoilState(hasuraTopicList);
  const setTopicList = useSetRecoilState(hasuraTopicList);
  const [userRepositoryList, setUserRepoList] = useRecoilState(userRepoList);
  const resetRepoList = useResetRecoilState(fetchRepoList);
  const todoUpdates = useSetRecoilState(forceTodoUpdate);
  const forceUpdate = () => todoUpdates((n) => n + 1);

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
    const {
      search: { edges: githubRepos },
    } = data;
    const reposToDisplay = githubRepos.filter(
      (index) => !repositories.some((repo) => repo.id === index.node.id)
    );
    setUserRepoList(reposToDisplay);
  };

  const [addNewRepo] = useMutation(createNewRepo);
  const [addNewTopics] = useMutation(insertNewTopic);
  const [linkRepoTopic] = useMutation(addREpoTopics);

  const insertRepository = (repo) => {
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
    }).then((_) => {
      forceUpdate();
      history.push("/");
    });
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
      <Button
        onClick={() => {
          resetRepoList();
        }}
      >
        refresh list
      </Button>
      {userRepositoryList !== undefined ? (
        userRepositoryList.map((repo) => (
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
