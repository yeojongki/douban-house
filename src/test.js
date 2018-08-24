import React, { Fragment } from 'react';
import './test.scss';

export default props => (
  <Fragment>
    <div className="test22">test22 div</div>
    <p className="test">Hello {props.name}</p>
    <style jsx>{`
      @import './test.scss';
      .test {
        background-color: aqua;
        height: 100px;
        padding: ${'large' in props ? '50' : '20'}px;
      }
      .test22 {
        height: 150px;
      }
      div {
        @include divvv(300px);
      }
    `}</style>
  </Fragment>
);
