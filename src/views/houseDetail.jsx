import React from 'react';

export default props => {
  const {
    match: {
      params: { id }
    }
  } = props;
  console.log(id);

  return <div>im house detail, current house tid is {id}</div>;
};
