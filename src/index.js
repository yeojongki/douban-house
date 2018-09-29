import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store from './store';
import router from './router';
import history from './history';
// import registerServiceWorker from './registerServiceWorker';

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <React.Fragment>
        <ConnectedRouter history={history}>{router}</ConnectedRouter>
        <style jsx global>{`
          @import './styles/index.scss';
        `}</style>
      </React.Fragment>
    </Provider>,
    document.getElementById('root')
  );
};

render();
// registerServiceWorker();
