import React from 'react';
import { Link } from 'react-router-dom';
import LazyImage from 'comp/LazyImage';
import { resolveScopedStyles } from '@/util';

const scoped = resolveScopedStyles(
  <scope>
    <style jsx>{`
      .thumb {
        width: 200px;
        height: 120px;
        border-radius: 7px;
      }
    `}</style>
  </scope>
);

export default props => {
  const { house } = props;
  return (
    <Link to={'/detail/' + house.tid}>
      <div className="house flexbox">
        <div className="house-img">
          <LazyImage
            src={house.imgs[0]}
            data-src={house.imgs[0]}
            className={`thumb ${scoped.className}`}
          />
        </div>
        <div className="house-info flexbox">
          <h3 className="house-info-title">{house.title}</h3>
          <p className="house-info-price">{`价格：${
            house.price ? house.price + '元' : '暂无'
          }`}</p>
        </div>
        <style jsx>{`
          @import '../../styles/index.scss';
          .house {
            padding: 20px;
            & + .house {
              border-top: 1px solid #f5f5f9;
            }
            &-img {
              flex: 1;
              margin-right: 15px;
            }
            &-info {
              flex: 4;
              flex-direction: column;
              justify-content: space-between;
              &-title {
                @include ellipsis(2);
                /* prettier-ignore */
                font-size: 14PX;
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
      {scoped.styles}
    </Link>
  );
};
