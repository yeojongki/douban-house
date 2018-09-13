import React from 'react';
import { Link } from 'react-router-dom';

export default props => {
  const { house } = props;
  let img = house.imgs[0];
  let imgSrc = img
    ? img.replace(/https:\/\//g, 'https://images.weserv.nl/?url=')
    : '';
  return (
    <Link to={'/detail/' + house.tid}>
      <div className="house flexbox">
        <div className="house-img">
          {imgSrc ? (
            <img
              src={img.replace(/https:\/\//g, 'https://images.weserv.nl/?url=')}
              alt=""
            />
          ) : (
            <div
              className="img"
              style={{
                backgroundImage: 'url(//img.yeojongki.cn/logo.png)',
                backgroundColor: '#f3f3f3'
              }}
              alt=""
            />
          )}
        </div>
        <div className="house-info flexbox">
          <h3 className="house-info-title">{house.title}</h3>
          <p className="house-info-price">{`价格：${house.price || '暂无'}`}</p>
        </div>
        <style jsx>{`
          @import '../styles/index.scss';
          .house {
            padding: 20px;
            & + .house {
              border-top: 1px solid #f5f5f9;
            }
            &-img {
              flex: 1;
              margin-right: 15px;
              img,
              .img {
                width: 200px;
                height: 120px;
              }
            }
            &-info {
              flex: 4;
              flex-direction: column;
              justify-content: space-between;
              &-title {
                @include ellipsis(2);
                font-size: 14px;
                margin: 0;
              }
              &-price {
                color: red;
                margin: 0;
                font-weight: 600;
              }
            }
          }
        `}</style>
      </div>
    </Link>
  );
};
