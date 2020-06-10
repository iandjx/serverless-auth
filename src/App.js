import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import RepositoryList from "./components/RepositoryList";
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
      </ul>

      <hr />

      {/*
    A <Switch> looks through all its children <Route>
    elements and renders the first one whose path
    matches the current URL. Use a <Switch> any time
    you have multiple routes, but you want only one
    of them to render at a time
  */}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/repositoryList">
          <RepositoryList />
        </Route>
      </Switch>
    </div>
  );
};
function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

export default App;
