import './scss/main.scss';
import 'isomorphic-fetch';
import 'abortcontroller-polyfill';

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainPage from './pages/Main';
import ErrorPage from './pages/Error';

const Error404Page = (props) => (
  <ErrorPage title="404 - Not Found" {...props} />
);

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={MainPage} />
      <Route path="*" component={Error404Page} />
    </Switch>
  );
};

export default App;
