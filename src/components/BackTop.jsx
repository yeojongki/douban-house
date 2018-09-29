import React, { Fragment } from 'react';
import { Icon } from 'antd-mobile';

export default props => (
    <Fragment>
      <button onClick={props.toTop}>
        <Icon color="#666" type="up" />
      </button>
      <style jsx>{`
        button {
          position: fixed;
          bottom: 230px;
          right: 100px;
          padding: 14px 16px;
          background: #fff;
          box-shadow: 0px 0px 10px #a7a7a7;
          border: 0;
          border-radius: 50%;
          transform: ${props.show ? 'scale(1)' : 'scale(.7)'};
          opacity: ${props.show ? 1 : 0};
          visibility: ${props.show ? 'visible' : 'hidden'};
          transition: all .3s;
        }
      `}</style>
    </Fragment>)
