import React, { Component, Fragment } from 'react';
import DefaultImg from '@/images/default.png';
const HTTPS_REG = /^(https:\/\/)/;

class ImgProxy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: DefaultImg,
      loaded: false,
      error: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.src) return null;
    if (nextProps.src && nextProps.src !== prevState.src) {
      let src = nextProps.src;
      if (HTTPS_REG.test(src)) {
        src = src.replace(HTTPS_REG, 'https://images.weserv.nl/?url=');
        return {
          src: src
        };
      }
    }
    return null;
  }

  render() {
    return (
      <Fragment>
        <img
          className={this.props.className}
          alt={this.props.alt}
          src={DefaultImg}
          onLoad={e => {
            if (this.state.loaded || this.state.error) return;
            e.target.src = this.state.src;
            // if loaded
            if (HTTPS_REG.test(this.state.src)) {
              this.setState({ loaded: true });
            }
          }}
          onError={e => {
            e.target.src = DefaultImg;
            this.setState({ error: true });
          }}
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

export default ImgProxy;
