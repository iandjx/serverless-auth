import { atom } from "recoil";

export const repositoryList = atom({
  key: "repositoryList",
  default: [],
});

export const currentUser = atom({
  key: "currentUser",
  default: {},
});
