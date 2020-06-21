import React, { useEffect } from "react";
import Repository from "./Repository";
import { useRecoilState } from "recoil";
import { repositoryList } from "../store";

const RepositoryList = () => {
  const [projectList] = useRecoilState(repositoryList);

  return (
    <div>
      {/* {console.log(cleanedData)}; */}
      {projectList &&
        projectList.map((project) => (
          <React.Fragment key={project.id}>
            <Repository project={project} />
          </React.Fragment>
        ))}
    </div>
  );
};

export default RepositoryList;
