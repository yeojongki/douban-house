import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Tabs from '@/views/Tabs';
import HouseDetail from '@/views/HouseDetail';
import HouseSearch from '@/views/HouseSearch';
import Login from '@/views/Login';

export default () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Tabs} />
      <Route path="/login" component={Login} />
      <Route path="/search" component={HouseSearch} />
      <Route path="/detail/:id" component={HouseDetail} />
    </Switch>
  </Router>
);
