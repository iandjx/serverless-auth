export const fetchAllTopics = `query fetchTopics {
    topics {
      id
      name
    }
  }`;

export const createNewRepo = `mutation createNewRepo($description: String = "", $id: String = "", $language: String = "", $name: String = "", $owner: String = "", $owner_id: uuid = "", $owner_node_id: String = "", $url: String = "") {
    insert_repositories_one(object: {description: $description, id: $id, language: $language, name: $name, owner: $owner, owner_id: $owner_id, owner_node_id: $owner_node_id, url: $url}) {
      description
      id
      language
      name
      owner
      owner_node_id
      url
    }
  }`;

export const addREpoTopics = `mutation addREpoTopics($objects: [repo_topic_insert_input!]! ) {
    insert_repo_topic(objects: $objects) {
      returning {
        repository_id
        topic_id
      }
    }
  }`;
export const insertNewTopic = `
  mutation MyMutation($objects: [topics_insert_input!]!) {
    insert_topics(objects: $objects) {
      returning {
        id
        name
      }
    }
  }`;

//if tag and search string present then use this
// if tag only present use this query
export const searchReposWithTag = `query searchReposWithTag($_in: [String!]!, $_similar: String!) {
    repositories(where: {repo_topics: {topic: {_and: {id: {_in: $_in}}}, repository: {name: {_similar: $_similar}}}}) {
      description
      id
      language
      name
      owner
      owner_node_id
      url
      repo_topics {
        topic {
          name
          id
        }
      }
    }
  }
  `;

export const searchRepos = `query searchRepos ( $_similar: String!) {
    repositories(where: {repo_topics: {repository: {name: {_similar: $_similar}}}}) {
      description
      id
      language
      name
      owner
      owner_node_id
      url
      repo_topics {
        topic {
          name
          id
        }
      }
    }
  }
  `;
export const fetchAllRepos = `query {
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
