import { atom } from "recoil";

export const repositoryList = atom({
  key: "repositoryList",
  default: [],
});

export const currentUser = atom({
  key: "currentUser",
  default: {},
});

export const userRepoList = atom({
  key: "userRepoList",
  default: [],
});

export const hasuraTopicList = atom({
  key: "hasuraTopicList",
  default: [],
});

export const selectedTopicList = atom({
  key: "selectedTopicList",
  default: [],
});

export const repoSearchString = atom({
  key: "repoSearchString",
  default: "",
});

export const fetchRepoTrigger = atom({
  key: "fetchRepoTrigger",
  default: 0,
});
//TODO add language atom
