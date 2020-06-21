// refactor atom files that have to be selectors instead
import { GraphQLClient } from "graphql-request";
import { selector } from "recoil";
import {
  fetchAllRepos,
  fetchAllTopics,
  searchRepos,
  searchReposWithTag,
} from "../queries/index";
import { selectedTopicList, repoSearchString } from "./index";
require("isomorphic-fetch");

const endpoint = "http://code-accel-backend.herokuapp.com/v1/graphql";

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "x-hasura-admin-secret": "i30LbO4dZlwjW95R8cP+D8hZ2OktZSMN",
  },
});

export const fetchRepoList = selector({
  key: "repoListSelector",
  get: async ({ get }) => {
    try {
      const response = await graphQLClient.request(fetchAllRepos);
      const data = await response.json();
      return data;
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
      //   const data = await response.json();
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
      const response = await fetch(`${endpoint}/auth/status`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
});

//add search repo with tag and search repo with string only
export const searchRepoOnTag = selector({
  key: "repoOnTagSelector",
  get: async ({ get }) => {
    if (get(selectedTopicList).length === 0) {
      return;
    }
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
  },
});

export const searchRepoOnString = selector({
  key: "repoOnStringSelector",
  get: async ({ get }) => {
    if (get(repoSearchString) === "" || get(selectedTopicList).length > 0) {
      return;
    }
    try {
      const variables = { _similar: `%${get(repoSearchString)}%` };
      const response = await graphQLClient.request(searchRepos, variables);
      return response;
    } catch (error) {
      throw error;
    }
  },
});
//after adding new repo into hasura
//
