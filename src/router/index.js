import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import Tabs from '@/views/Tabs';

function LoadingComponent({ error, pastDelay }) {
  if (error) {
    return <div>Error!</div>;
  } else if (pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

const Login = Loadable({
  loader: () => import('@/views/Login'),
  loading: LoadingComponent
});

const About = Loadable({
  loader: () => import('@/views/About'),
  loading: LoadingComponent
});

const HouseSearch = Loadable({
  loader: () => import('@/views/HouseSearch'),
  loading: LoadingComponent
});

const HouseDetail = Loadable({
  loader: () => import('@/views/HouseDetail'),
  loading: LoadingComponent
});

export default () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Tabs} />
      <Route path="/login" component={Login} />
      <Route path="/about" component={About} />
      <Route path="/search" component={HouseSearch} />
      <Route path="/detail/:id" component={HouseDetail} />
    </Switch>
  </Router>
);
