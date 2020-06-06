import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  function eraseCookieFromAllPaths(name) {
    // This function will attempt to remove a cookie from all paths.
    var pathBits = window.location.pathname.split("/");
    var pathCurrent = " path=";

    // do a simple pathless delete first.
    document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;";

    for (var i = 0; i < pathBits.length; i++) {
      pathCurrent += (pathCurrent.substr(-1) !== "/" ? "/" : "") + pathBits[i];
      document.cookie =
        name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;" + pathCurrent + ";";
    }
  }

  const [currentUser, setCurrentUser] = useState({});

  async function fetchProfile() {
    await fetch("/.netlify/functions/auth/me").then((res) =>
      res.json().then((res) => setCurrentUser(res))
    );
  }

  async function fetchLogout() {
    await fetch("/.netlify/functions/auth/logout").then((res) => {
      setCurrentUser({});
    });
    eraseCookieFromAllPaths("session");
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {currentUser && currentUser && currentUser.id ? (
          <>
            <p>{currentUser.token}</p>
            <p>Hello {currentUser.userName}</p>
            <p>{JSON.stringify(currentUser)}</p>
            <div className="App-link" onClick={fetchLogout}>
              Logout
            </div>
          </>
        ) : (
          <>
            <img src={logo} className="App-logo" alt="logo" />
            <p>Sample demo to show Netlify login with PassportJS</p>
            <a
              className="App-link"
              href={`/.netlify/functions/auth/github?host=${
                window.location.origin
              }`}
            >
              Login with Github
            </a>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
