import React, { Fragment } from 'react';

export default props => (
  <Fragment>
    <svg className="icon" aria-hidden="true">
      <use xlinkHref={`#icon-${props.name}`} />
    </svg>
    <style jsx>{`
      .icon {
        width: ${props.width || 22}PX;
        height: ${props.height || 22}PX;
        vertical-align: -0.15em;
        fill: ${props.color || 'currentColor'};
        overflow: hidden;
      }
    `}</style>
  </Fragment>
);
