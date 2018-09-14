import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  root: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    display: 'flex',
    flexDirection: 'row'
  },
  inner: {
    backgroundColor: 'rgba(0,0,0,.6)',
    padding: '5px 10px',
    borderRadius: 5,
    color: '#fff'
  }
};

class Pagination extends React.Component {
  render() {
    const { index, dots } = this.props;
    return (
      <div style={styles.root}>
        <span style={styles.inner}>
          {index + 1}/{dots}
        </span>
      </div>
    );
  }
}

Pagination.propTypes = {
  dots: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

export default Pagination;
