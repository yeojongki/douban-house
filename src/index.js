import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import { Provider } from 'react-redux';
import store from './store';

// import registerServiceWorker from './registerServiceWorker';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Provider store={store}>
          <Router />
        </Provider>
        <style jsx global>{`
          @import './styles/index.scss';
        `}</style>
      </Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
