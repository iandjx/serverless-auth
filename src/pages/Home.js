//refactor
//display searchrepo and repo list component
//refactor searrepo and repolist component so that they share the same data
import React, { useEffect } from "react";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import {
  currentUser,
  repositoryList,
  hasuraTopicList,
  searchRepoFinal,
  fetchUserDetails,
  selectedTopicList,
  repoSearchString,
} from "../store";
import { useQuery, useManualQuery } from "graphql-hooks";
import { fetchAllRepos, fetchAllTopics } from "../queries/index";
import SearchRepo from "../components/SearchRepo";
import RepositoryList from "../components/RepositoryList";

const Home = () => {
  const searchResults = useRecoilValue(searchRepoFinal);
  const currentUser = useRecoilValue(fetchUserDetails);
  //TODO add auth check to display login and add repo
  const [_topicList, setSelectTopicList] = useRecoilState(selectedTopicList);
  const [_repoSearchString, setRepositorySearchString] = useRecoilState(
    repoSearchString
  );

  useEffect(() => {
    setSelectTopicList([]);
    setRepositorySearchString("");
  }, []);

  return (
    <div>
      <SearchRepo />
      <RepositoryList />
    </div>
  );
};

export default Home;
