import React from 'react';

export default props => (
  <header className="flexbox">
    {props.children}
    <style jsx>{`
        header {
            padding: 20px 0;
        }
    `}</style>
  </header>
);
