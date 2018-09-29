import React from 'react';
export default props => (
  <button onClick={props.onClick}>
    {props.children}
    <style jsx>{`
      @import '../styles/mixins';
      button {
        display: inline-block;
        outline: 0 none;
        -webkit-appearance: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
        /* prettier-ignore */
        font-size: 14PX;
        /* prettier-ignore */
        border-radius: 5PX;
        height: 55px;
        @include ellipsis();
        border: 1px solid #ddd;
        padding: ${'large' in props ? '0 50' : '0 10'}px;
        color: ${props.color ? props.color : '#333'};
        background-color: ${props.bg ? props.bg : '#fff'};
        border-color: ${props.borderColor ? props.borderColor : '#ddd'};
        margin-left: ${props.mLeft ? props.mLeft : 0}px;
        margin-right: ${props.mRight ? props.mRight : 0}px;
      }
    `}</style>
  </button>
);
