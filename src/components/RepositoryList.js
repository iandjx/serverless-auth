import React, { useState, useEffect } from "react";
import Repository from "./Repository";
import { useSetRecoilState, useRecoilState } from "recoil";
import { repositoryList } from "../store";
require(`isomorphic-fetch`);

const query = `query  {
    repositories {
      id
      name
      owner
      owner_node_id
      url
      description
      language
      repo_topics {
        topic {
          name
        }
      }
    }
  }
  `;

const RepositoryList = () => {
  const updateList = useSetRecoilState(repositoryList);
  const projectList = useRecoilState(repositoryList);
  useEffect(() => {
    fetch("https://code-accel-backend.herokuapp.com/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": "i30LbO4dZlwjW95R8cP+D8hZ2OktZSMN",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.data.repositories);
        updateList((oldList) => [...oldList, ...response.data.repositories]);
      })
      .catch((error) => console.log(error));
  }, [updateList]);
  return (
    <div>
      {projectList[0] &&
        projectList[0].map((project) => (
          <React.Fragment key={project.id}>
            <Repository project={project} />
          </React.Fragment>
        ))}
    </div>
  );
};

export default RepositoryList;
