// refactor atom files that have to be selectors instead
import { GraphQLClient } from "graphql-request";
import { selector } from "recoil";
import {
  fetchAllRepos,
  fetchAllTopics,
  searchRepos,
  searchReposWithTag,
} from "../queries/index";
import {
  selectedTopicList,
  repoSearchString,
  fetchRepoTrigger,
  forceTodoUpdate,
  repoResult,
} from "./index";
import { Recoil } from "recoil";
require("isomorphic-fetch");

const endpoint = "http://code-accel-backend.herokuapp.com/v1/graphql";

const authEndpoint =
  process.env.NODE_ENV === "development" ? "/.netlify/functions" : "/api";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "x-hasura-admin-secret": "i30LbO4dZlwjW95R8cP+D8hZ2OktZSMN",
  },
});

export const fetchRepoList = selector({
  key: "fetchRepoList",

  get: async ({ get }) => {
    // get(fetchRepoTrigger);
    try {
      get(forceTodoUpdate);
      const response = await graphQLClient.request(fetchAllRepos);
      return response;
    } catch (error) {
      throw error;
    }
  },
});

export const fetchTopicList = selector({
  key: "topicListSelector",
  get: async ({ get }) => {
    try {
      const response = await graphQLClient.request(fetchAllTopics);
      return response;
    } catch (error) {
      throw error;
    }
  },
});

export const fetchUserDetails = selector({
  key: "userDetailsSelector",
  get: async ({ get }) => {
    try {
      const response = await fetch(`${authEndpoint}/auth/status`);
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: "not authorized" };
    }
  },
});

export const searchRepoFinal = selector({
  key: "searchRepoFinalSelector",
  get: async ({ get }) => {
    if (get(repoSearchString) === "" && get(selectedTopicList).length === 0) {
      console.log("cancel");
      return [];
    }
    if (get(repoSearchString) !== "" || get(selectedTopicList).length === 0) {
      try {
        console.log("second if");
        const variables = { _similar: `%${get(repoSearchString)}%` };
        const response = await graphQLClient.request(searchRepos, variables);
        return response;
      } catch (error) {
        throw error;
      }
    }

    if (get(selectedTopicList).length !== 0) {
      try {
        const idArray = get(selectedTopicList).map((val) => val.id);
        const variables = {
          _in: idArray,
          _similar: `%${get(repoSearchString)}%`,
        };
        const response = await graphQLClient.request(
          searchReposWithTag,
          variables
        );
        return response;
      } catch (error) {
        throw error;
      }
    }
    return;
  },
});
