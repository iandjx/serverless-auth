import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Repository from "./Repository";
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
  const [projectList, setProjectList] = useState([]);

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
        console.log(JSON.stringify(response.data));
        return setProjectList(response.data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      {/* {console.log(projectList.repositories)} */}
      {projectList.repositories &&
        projectList.repositories.map((project) => (
          <Repository key={project.id} project={project} />
        ))}
    </div>
  );
};

export default RepositoryList;
