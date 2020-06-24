import React, { useState } from "react";
import {
  selectedTopicList,
  repoSearchString,
  fetchTopicList,
  searchRepoFinal,
  repoResult,
} from "../store";

import { useRecoilState, useRecoilValue } from "recoil";
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
  //TODO Change search repo string to language instead.
  //people wont search repos by name
  const topicList = useRecoilValue(fetchTopicList);
  const [chipInput, updateChipInput] = useState([]);
  const [searchString, updateSearchString] = useState("");
  const [repoResulta] = useRecoilState(repoResult);

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
