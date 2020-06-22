import React, { useEffect, useState } from "react";
import {
  selectedTopicList,
  repoSearchString,
  fetchTopicList,
  searchRepoOnTag,
  searchRepoOnString,
  searchRepoFinal,
  fetchRepoList,
} from "../store";

import { useQuery, useManualQuery } from "graphql-hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { fetchAllTopics } from "../queries";

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
  const topicList = useRecoilValue(fetchTopicList);
  const [chipInput, updateChipInput] = useState([]);
  const [searchString, updateSearchString] = useState("");
  const searchRepo = useRecoilValue(searchRepoFinal);

  const [_topicList, setSelectTopicList] = useRecoilState(selectedTopicList);
  const [_repoSearchString, setRepositorySearchString] = useRecoilState(
    repoSearchString
  );
  // const searchRepoWithString = useRecoilValue(searchRepoOnString);

  const handleClicka = () => {
    setSelectTopicList(chipInput);
    setRepositorySearchString(searchString);
  };
  const classes = useStyles();

  return (
    <div className="addItemContainer">
      <div>{JSON.stringify(searchRepo)}</div>
      <p className="addItemText">Enter item :</p>
      <input
        className="addItemInput"
        type="text"
        value={searchString}
        onChange={(event) => {
          const { value } = event.target;
          updateSearchString(value);
        }}
      />
      <div>{JSON.stringify(searchRepo)}</div>

      <div className={classes.root}>
        <div>{`value: ${chipInput !== null ? `'${chipInput}'` : "null"}`}</div>
        <Autocomplete
          value={chipInput}
          onChange={(event, newValue) => {
            updateChipInput(newValue);
          }}
          multiple
          id="tags-outlined"
          options={topicList.topics}
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
      <button className="addInputButton" onClick={handleClicka}>
        Add
      </button>
    </div>
  );
};

export default SearchRepo;
