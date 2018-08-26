import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
// import registerServiceWorker from './registerServiceWorker';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router />
        <style jsx global>{`
          @import './styles/index.scss';
        `}</style>
      </Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
