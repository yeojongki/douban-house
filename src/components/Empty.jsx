import React from 'react';

export default props => (
  <div className="empty">
    {props.text}
    <style jsx>{`
      .empty {
        color: #666;
        margin-top: 50%;
        text-align: center;
      }
    `}</style>
  </div>
);
