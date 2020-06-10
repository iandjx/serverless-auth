import React, { useState, useEffect } from "react";
import { currentUser } from "../store";
import { useSetRecoilState, useRecoilState } from "recoil";

function Auth() {
  const setCurrentUser = useSetRecoilState(currentUser);
  const user = useRecoilState(currentUser);
  const endpoint =
    process.env.NODE_ENV === "development" ? "/.netlify/functions" : "/api";

  async function fetchProfile() {
    await fetch(`${endpoint}/auth/status`).then((res) =>
      res.json().then((res) => setCurrentUser(res))
    );
  }

  // async function fetchLogout() {
  //   await fetch("/.netlify/functions/auth/logout").then((res) => {
  //     setCurrentUser({});
  //   });
  //   eraseCookieFromAllPaths("session");
  // }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="App">
      {console.log(user)}
      <header className="App-header">
        {user && user[0].id ? (
          <p>{JSON.stringify(user)}</p>
        ) : (
          <>
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <p>Sample demo to show Netlify login with PassportJS</p>
            <a
              className="App-link"
              href={`${endpoint}/auth/github?host=${window.location.origin}`}
            >
              Login with Github
            </a>
          </>
        )}
      </header>
    </div>
  );
}

export default Auth;
