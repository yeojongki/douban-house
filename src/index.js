import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';
import Test from './test';

class App extends Component {
  render() {
    return (
      <div>
        <Test large name="test"/>
        <div className="divvv">i'm divvv</div>
        <p>
          only this paragraph will get the style :)
          <a>aaaaaaaaaaaaa tag</a>
        </p>

        {/* you can include <Component />s here that include
         other <p>s that don't get unexpected styles! */}

        <style jsx>{`
          p {
            color: red;
            display: flex;
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
