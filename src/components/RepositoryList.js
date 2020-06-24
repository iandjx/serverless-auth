import React, { useEffect } from "react";
import Repository from "./Repository";
import { useRecoilState, useRecoilValue } from "recoil";
import { repositoryList, fetchRepoList, searchRepoFinal } from "../store";

const RepositoryList = () => {
  const { repositories } = useRecoilValue(fetchRepoList);

  const { repositories: searchedRepositories } = useRecoilValue(
    searchRepoFinal
  );

  let reposToDisplay;
  if (searchedRepositories) {
    reposToDisplay = searchedRepositories.map((project) => (
      <React.Fragment key={project.id}>
        <Repository project={project} />
      </React.Fragment>
    ));
  } else {
    reposToDisplay = repositories.map((project) => (
      <React.Fragment key={project.id}>
        <Repository project={project} />
      </React.Fragment>
    ));
  }
  return <div>{reposToDisplay};</div>;
};

export default RepositoryList;
