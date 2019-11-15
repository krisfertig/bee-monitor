import React from 'react';
//import Routes from './routes';

import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import SignUp from "./layouts/SignUp";
import SignIn from "./layouts/SignIn";

import { isAuthenticated } from "./services/auth";

import "assets/css/material-dashboard-react.css?v=1.8.0";
import "./styles/global";

const hist = createBrowserHistory();

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const App = () => {
  return (
    <Router history={hist}>
      <Switch>
        <Route exact path="/" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <PrivateRoute path="/app" component={Admin} />
        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
    </Router>
  );
}

export default App;