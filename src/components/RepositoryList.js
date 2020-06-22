import React, { useEffect } from "react";
import Repository from "./Repository";
import { useRecoilState, useRecoilValue } from "recoil";
import { repositoryList, fetchRepoList } from "../store";

const RepositoryList = () => {
  const { repositories } = useRecoilValue(fetchRepoList);

  return (
    <div>
      {repositories &&
        repositories.map((project) => (
          <React.Fragment key={project.id}>
            <Repository project={project} />
          </React.Fragment>
        ))}
    </div>
  );
};

export default RepositoryList;
