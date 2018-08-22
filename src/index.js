import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';

class App extends Component {
  render() {
    return (
      <div>
        <p>only this paragraph will get the style :)<a>aaaaaaaaaaaaa tag</a></p>

        {/* you can include <Component />s here that include
         other <p>s that don't get unexpected styles! */}

        <style jsx>{`
          p {
            color: red;
            a {
              color: pink;
            }
          }
        `}</style>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
