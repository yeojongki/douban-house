import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Tabs from '@/views/tabs';
import HouseDetail from '@/views/houseDetail';
import HouseSearch from '@/views/houseSearch';

export default () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Tabs} />
      <Route path="/search" component={HouseSearch} />
      <Route path="/detail/:id" component={HouseDetail} />
    </Switch>
  </Router>
);
