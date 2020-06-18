import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import RepositoryList from "./components/RepositoryList";
import AddRepository from "./components/AddRepository";
import SearchRepo from "./components/SearchRepo";
import Home from "./pages/Home";
const endpoint =
  process.env.NODE_ENV === "development" ? "/.netlify/functions" : "/api";

const App = () => {
  return (
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
  );
};

export default App;
