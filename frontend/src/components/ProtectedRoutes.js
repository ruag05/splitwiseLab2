import React from "react";
import { Redirect, Route } from "react-router-dom";
import { authContext } from "../context/AuthContext";

export default function ProtectedRoutes({ children, ...rest }) {
  const auth = React.useContext(authContext).state;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/home",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
