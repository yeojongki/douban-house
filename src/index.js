import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';
import Layout from '@/views/layout';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          
        </Layout>
        <style jsx global>{`
          @import './styles/index.scss';
        `}</style>

      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
