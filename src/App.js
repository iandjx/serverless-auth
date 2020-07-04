import React, { useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import RepositoryList from "./components/RepositoryList";
import AddRepository from "./components/AddRepository";
import SearchRepo from "./components/SearchRepo";
import Home from "./pages/Home";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { fetchUserDetails } from "./store";
import { useRecoilValue } from "recoil";

const endpoint =
  process.env.NODE_ENV === "development" ? "/.netlify/functions" : "/api";

const githubEndpoint = `https://api.github.com/graphql`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const App = () => {
  const classes = useStyles();

  const currentUser = useRecoilValue(fetchUserDetails);
  useEffect(() => {}, []);
  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            ></IconButton>
            <Typography variant="h6" className={classes.title}>
              News
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
      <div>
        <ul>
          <li>
            <Link to="/">test</Link>
          </li>
          <li>
            <a href={`${endpoint}/auth/github?host=${window.location.origin}`}>
              Login
            </a>
          </li>
          <li>
            <Link to="/repositoryList">repo</Link>
          </li>
          <li>
            <Link to="/addRepo">Add Repository</Link>
          </li>
          <li>
            <Link to="/searchRepo">Search Repo</Link>
          </li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/repositoryList">
            <RepositoryList />
          </Route>
          <Route path="/addRepo">
            <AddRepository />
          </Route>
          <Route path="/searchRepo">
            <SearchRepo />
          </Route>
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default App;
