import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

class AuthRouteContainer extends React.Component {
  render() {
    const { isLogin, component: Component, ...props } = this.props;

    return (
      <Route
        {...props}
        render={props =>
          isLogin ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  isLogin: Boolean(state.user.token)
});

export default connect(mapStateToProps)(AuthRouteContainer);
