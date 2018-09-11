import React from 'react';
import HouseItem from './houseItem';

export default props => {
  const { list } = props;
  return list.length ? (
    <div className="list">
      {list.map(item => (
        <HouseItem house={item} key={item.tid} />
      ))}
      <style jsx>{`
        .list {
          background: #fff;
          margin-top: 15px;
        }
      `}</style>
    </div>
  ) : null;
};
