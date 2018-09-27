import React, { Component, Fragment } from 'react';
import LazyLoad from 'vanilla-lazyload';
import DefaultImg from '@/images/default.png';
const HTTPS_REG = /^(https:\/\/)/;

if (!document.lazyLoadInstance) {
  document.lazyLoadInstance = new LazyLoad({
    element_selector: '.lazy',
    callback_error: e => (e.src = DefaultImg)
  });
}

export class LazyImage extends Component {
  // Update lazyLoad after first rendering of every image
  componentDidMount() {
    document.lazyLoadInstance.update();
  }

  // Update lazyLoad after rerendering of every image
  componentDidUpdate() {
    document.lazyLoadInstance.update();
  }

  // Just render the image with data-src
  render() {
    const { alt, src, className } = this.props;
    return (
      <Fragment>
        <img
          alt={alt}
          src={DefaultImg}
          className={`lazy ${className ? className : ''}`}
          data-src={
            src
              ? src.replace(HTTPS_REG, 'https://images.weserv.nl/?url=')
              : DefaultImg
          }
        />
        <style jsx>{`
          img {
            width: 100%;
            height: 450px;
            display: block;
          }
        `}</style>
      </Fragment>
    );
  }
}

export default LazyImage;
