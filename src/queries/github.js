export const repoSearchQuery = `query repoSearchQuery($search_string: String!) {
  search(type: REPOSITORY, first: 50, query: $search_string) {
    edges {
      node {
        ... on Repository {
          name
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
                id
              }
            }
          }
          owner {
            login
            url
            id
          }
          description
          id
          url
          primaryLanguage {
            name
          }
        }
      }
    }
  }
}

  `;
