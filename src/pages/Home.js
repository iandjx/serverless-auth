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
} from "../store";
import { useQuery, useManualQuery } from "graphql-hooks";
import { fetchAllRepos, fetchAllTopics } from "../queries/index";
import SearchRepo from "../components/SearchRepo";
import RepositoryList from "../components/RepositoryList";

const Home = () => {
  const searchResults = useRecoilValue(searchRepoFinal);
  const currentUser = useRecoilValue(fetchUserDetails);

  return (
    <div>
      {console.log(currentUser)}
      <SearchRepo />
      {/* <RepositoryList /> */}
    </div>
  );
};

export default Home;
