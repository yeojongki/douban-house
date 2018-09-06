import React from 'react';

export default props => {
  const { house } = props;
  return (
    <div className="house flexbox">
      <div className="house-img">
        <img src={house.img} alt="" />
      </div>
      <div className="house-info flexbox">
        <h3 className="house-info-title">{house.title}</h3>
        <p className="house-info-price">{`价格：${house.price||'暂无'}`}</p>
      </div>
      <style jsx>{`
        @import '../styles/index.scss';
        .house {
          padding: 20px;
          &+.house {
            border-top: 1px solid #f5f5f9;
          }
          &-img {
            flex: 1;
            margin-right:15px;
            img {
              width: 200px;
              height: 120px;
            }
          }
          &-info {
            flex:4;
            flex-direction: column;
            justify-content: space-between;
            &-title {
              @include ellipsis(2);
              font-size:14PX;
              margin:0;
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
  );
};
