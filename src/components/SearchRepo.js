import React, { useState } from "react";
import {
  selectedTopicList,
  repoSearchString,
  fetchTopicList,
  searchRepoFinal,
  repoResult,
  fetchLanguageList,
  selectedLanguage,
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

  const [_topicList, setSelectTopicList] = useRecoilState(selectedTopicList);
  const [_repoSearchString, setRepositorySearchString] = useRecoilState(
    repoSearchString
  );
  const [_language, setSelectedLanguage] = useRecoilState(selectedLanguage);
  // const searchRepoWithString = useRecoilValue(searchRepoOnString);
  //get language list
  const { repositories: languageList } = useRecoilValue(fetchLanguageList);
  const hasuraLanguageList = languageList.map((ele) => {
    return ele.language;
  });
  let uniqueHasuraLanguageList = [...new Set(hasuraLanguageList), ""];
  const [languageInput, updateLanguageInput] = useState("");
  console.log(languageInput);

  const handleClicka = () => {
    setSelectTopicList(chipInput);
    setSelectedLanguage(languageInput);
    updateChipInput([]);
    updateLanguageInput("");
  };
  const classes = useStyles();

  return (
    <div className="addItemContainer">
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
      <Autocomplete
        id="combo-box-demo"
        value={languageInput}
        onChange={(event, newValue) => {
          updateLanguageInput(newValue);
        }}
        options={uniqueHasuraLanguageList}
        getOptionLabel={(option) => option}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Combo box" variant="outlined" />
        )}
      />
      <button className="addInputButton" onClick={handleClicka}>
        Add
      </button>
    </div>
  );
};

export default SearchRepo;
