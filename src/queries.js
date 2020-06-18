//   mutation MyMutation($objects: [repo_topic_insert_input!]!) {
//     insert_repo_topic(objects: $objects) {
//       affected_rows
//     }
//   }
//   {
//     "objects": [{
//       "repository_id": "823hjksdh",
//       "topic_id": "123"
//     },{"repository_id": "823hjksdh",
//       "topic_id": "456"}]
//   }

// query MyQuery {
//     repositories(where: {repo_topics: {topic: {_and: {id: {_in: ["MDU6VG9waWNhbmRyb2lk","123"]}}}}}) {
//       description
//       id
//       language
//       name
//       owner
//       owner_node_id
//       url
//       repo_topics {
//         topic {
//           name
//           id
//         }
//       }
//     }
//   }
