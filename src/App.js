import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  function deleteAllCookies() {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
      var d = window.location.hostname.split(".");
      while (d.length > 0) {
        var cookieBase =
          encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
          "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
          d.join(".") +
          " ;path=";
        var p = window.location.pathname.split("/");
        document.cookie = cookieBase + "/";
        while (p.length > 0) {
          document.cookie = cookieBase + p.join("/");
          p.pop();
        }
        d.shift();
      }
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
    deleteAllCookies();
  }

  useEffect(() => {
    fetchProfile();
    deleteAllCookies();
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
