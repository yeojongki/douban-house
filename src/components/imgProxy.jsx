import React, { Fragment } from 'react';

export default props => {
  console.log(props);
  const { src, className, circle } = props;
  let imgSrc = src
    ? src.replace(/https:\/\//g, 'https://images.weserv.nl/?url=')
    : '';
  let style = {};
  if (circle) {
    style.borderRadius = '50%';
  }
  return (
    <Fragment>
      <img className={className} src={imgSrc} alt={props.title} />
      <style jsx>{`
        img {
          width:100%;
          height: 450px;
          display: block;
        }
      `}</style>
    </Fragment>
  );
};
