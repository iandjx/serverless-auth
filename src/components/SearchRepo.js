import React, { useEffect, useState } from "react";
import { hasuraTopicList, repositoryList } from "../store";
import {
  searchReposWithTag,
  searchRepos,
  fetchAllTopics,
  fetchAllRepos,
} from "../queries/index";
import { useQuery, useManualQuery } from "graphql-hooks";
import { useRecoilState, useSetRecoilState } from "recoil";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
}));

const SearchRepo = () => {
  //load topiclist
  const topicList = useRecoilState(hasuraTopicList);
  const setTopicList = useSetRecoilState(hasuraTopicList);
  const projectList = useRecoilState(repositoryList);
  const setProjectList = useSetRecoilState(repositoryList);
  const { data: topicData } = useQuery(fetchAllTopics);
  const [value, setValue] = React.useState([]);

  useEffect(() => {
    setTopicList(topicData);
  }, [topicData]);
  const { data: repoData } = useQuery(fetchAllRepos);
  useEffect(() => {
    setProjectList(repoData);
  }, [repoData]);
  const [inputValue, setInput] = useState("");
  const changeValue = (event) => {
    const { value } = event.target;
    setInput(value);
  };
  const [searchRepositories, { data: searchResult }] = useManualQuery(
    searchRepos,
    { variables: { _similar: `%${inputValue}%` } }
  );

  const [searchRepositoriesWithTag] = useManualQuery(searchReposWithTag);

  const fetchRepositoriesWithTag = async () => {
    const idArray = value.map((val) => val.id);
    const result = await searchRepositoriesWithTag({
      variables: { _in: idArray, _similar: `%${inputValue}%` },
    });
    console.log(result);
    return result;
  };

  let chipDataSource = [];
  let cleanedData = [];

  if (topicList[0] !== undefined && topicList[0].topics !== undefined) {
    cleanedData = [...topicList[0].topics];
    chipDataSource = topicList[0].topics.reduce((acc, topic) => {
      acc.push(topic.name);
      return acc;
    }, []);
  }

  //user enters search string or

  //user enters topics in chips

  //user hits search
  //if search string only then use query for search string
  // if search string and tag  then other query
  // else same other query

  //update recoil project list
  const classes = useStyles();

  return (
    <div className="addItemContainer">
      {console.log(cleanedData)}
      {/* {console.log(chipDataSource)} */}
      <p className="addItemText">Enter item :</p>
      <input
        className="addItemInput"
        type="text"
        value={inputValue}
        onChange={(e) => changeValue(e)}
      />
      <button className="addInputButton" onClick={searchRepositories}>
        Add
      </button>
      {searchResult && <p>{JSON.stringify(searchResult)}</p>}
      <div className={classes.root}>
        <div>{`value: ${value !== null ? `'${value}'` : "null"}`}</div>
        {console.log(value)}
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          multiple
          id="tags-outlined"
          options={cleanedData}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="filterSelectedOptions"
              placeholder="Favorites"
            />
          )}
        />
      </div>
      <button className="addInputButton" onClick={fetchRepositoriesWithTag}>
        Add
      </button>
    </div>
  );
};

export default SearchRepo;
