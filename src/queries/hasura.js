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

// export const insertNewTopics = `mutation insertNewTopics($objects: [topics_insert_input!]) {
//     insert_topics(objects: $objects) {
//       returning {
//         id
//         name
//       }
//     }
//   }`;

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
