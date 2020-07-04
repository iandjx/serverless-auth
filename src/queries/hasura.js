export const fetchAllTopics = `query fetchTopics {
    topics {
      id
      name
    }
  }`;

export const fetchAllLanguages = `query fetchAllLanguages {
  repositories {
    language
  }
}
`;
export const createNewRepo = `mutation createNewRepo($description: String = "", $id: String = "", $language: String = "", $name: String = "", $owner: String = "", $owner_id: uuid = "", $owner_node_id: String = "", $url: String = "", $good_first_issue_count: Int = 10, $issue_hunt_count: Int = 10) {
  insert_repositories_one(object: {description: $description, id: $id, language: $language, name: $name, owner: $owner, owner_id: $owner_id, owner_node_id: $owner_node_id, url: $url, good_first_issue_count: $good_first_issue_count, issue_hunt_count: $issue_hunt_count}) {
    description
    id
    language
    name
    owner
    owner_node_id
    url
    issue_hunt_count
    good_first_issue_count
  }
}
`;

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
export const searchReposWithTag = `query searchReposWithTag($_in: [String], $_similar: String) {
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

export const searchReposWithTagAndLanguage = `query searchReposWithTagAndLanguage($_similar: String , $_in: [String!]) {
    repositories(where: {_and: {language: {_similar: $_similar}, repo_topics: {topic: {id: {_in: $_in}}}}}) {
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

export const fetchAllRepos = `{
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
    issue_hunt_count
    good_first_issue_count
  }
}`;

export const searchRepoByLanguage = `
  query searchRepoByLanguage($_eq: String) {
    repositories(where: {language: {_eq: $_eq}}) {
      description
      id
      language
      name
      owner
      owner_node_id
      repo_topics {
        topic {
          id
          name
        }
      }
      url
    }
  }
  `;
