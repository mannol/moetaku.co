import './scss/main.scss';
import 'isomorphic-fetch';
import 'abortcontroller-polyfill';

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from './pages/Main';
import Error from './pages/Error';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="*">
        <Error title="404 - Not Found" />
      </Route>
    </Switch>
  );
};

export default App;
