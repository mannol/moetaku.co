import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Main from './pages/Main';

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Redirect path="*" to="/" />
    </Switch>
  );
};

export default App;
