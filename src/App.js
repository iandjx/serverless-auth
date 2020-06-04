import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
      deleteAllCookies();
      setCurrentUser({});
    });
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
