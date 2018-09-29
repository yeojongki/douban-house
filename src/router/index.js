import React from 'react';
import routes from './routes';
import { Route, Switch } from 'react-router-dom';
import AuthRouteContainer from './AuthRouteContainer';

export default (
  <React.Fragment>
    <Switch>
      {routes.map(route => {
        return route.auth ? (
          <AuthRouteContainer
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ) : (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        );
      })}
    </Switch>
  </React.Fragment>
);
