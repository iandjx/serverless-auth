import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import { SubscriptionClient } from "subscriptions-transport-ws";
import memCache from "graphql-hooks-memcache";

const client = new GraphQLClient({
  url: `http://code-accel-backend.herokuapp.com/v1/graphql`,
  headers: { "x-hasura-admin-secret": "i30LbO4dZlwjW95R8cP+D8hZ2OktZSMN" },
  cache: memCache(),
  subscriptionClient: new SubscriptionClient(
    `ws://code-accel-backend.herokuapp.com/v1/graphql`,
    {
      connectionParams: {
        headers: {
          "x-hasura-admin-secret": "i30LbO4dZlwjW95R8cP+D8hZ2OktZSMN",
        },
      },
      reconnect: true,
    }
  ),
});
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <React.Suspense fallback={<div>Loading...</div>}>
          <CssBaseline />
          <ClientContext.Provider value={client}>
            <App />
          </ClientContext.Provider>
        </React.Suspense>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
