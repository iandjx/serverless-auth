//refactor
//display searchrepo and repo list component
//refactor searrepo and repolist component so that they share the same data
import React, { useEffect } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { currentUser, repositoryList, hasuraTopicList } from "../store";
import { useQuery, useManualQuery } from "graphql-hooks";
import { fetchAllRepos, fetchAllTopics } from "../queries/index";
import SearchRepo from "../components/SearchRepo";
import RepositoryList from "../components/RepositoryList";

require("isomorphic-fetch");

const Home = () => {
  //change useRecoilState to useRecoil values for selectors
  //refactor
  const [projectList, updateRepoList] = useRecoilState(repositoryList);
  const topicList = useRecoilState(hasuraTopicList);
  const updateTopicList = useSetRecoilState(hasuraTopicList);

  const [user, setCurrentUser] = useRecoilState(currentUser);

  const { data: repoData } = useQuery(fetchAllRepos);
  useEffect(() => {
    updateRepoList(repoData);
  }, [repoData]);

  const { data: topicData } = useQuery(fetchAllTopics);
  useEffect(() => {
    updateTopicList(topicData);
  }, [topicData]);

  const endpoint =
    process.env.NODE_ENV === "development" ? "/.netlify/functions" : "/api";

  useEffect(() => {
    fetch(`${endpoint}/auth/status`).then((res) =>
      res.json().then((res) => setCurrentUser(res))
    );
  }, []);

  //load all repos
  //load all topics

  return (
    <div>
      {console.log(projectList)}
      <SearchRepo />
      <RepositoryList />
    </div>
  );
};

export default Home;
