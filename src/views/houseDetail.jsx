import React, { Component } from 'react';
import { List } from 'antd-mobile';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Pagination from 'comp/Pagination';
import { GetHouseById } from '@/api';
import ImgProxy from 'comp/imgProxy';
import { resolveScopedStyles } from '@/util';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const scoped = resolveScopedStyles(
  <scope>
    <style jsx>{`
      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    `}</style>
  </scope>
);

class HouseDetail extends Component {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { id }
      }
    } = props;
    this.id = id;
    this.state = {
      imgHeight: 176,
      index: 0,
      house: {
        imgs: []
      }
    };
  }

  handleChangeIndex = index => {
    this.setState({
      index
    });
  };

  componentDidMount() {
    GetHouseById(this.id).then(res => {
      if (res) {
        console.log(res);
        this.setState({
          house: res
        });
      }
    });
  }
  render() {
    let { house, index } = this.state;
    return (
      <div className="house">
        <div className="carousel">
          <AutoPlaySwipeableViews
            resistance
            index={index}
            onChangeIndex={this.handleChangeIndex}
          >
            {house.imgs.map(i => (
              <ImgProxy src={i} key={i} />
            ))}
          </AutoPlaySwipeableViews>
          <Pagination
            dots={house.imgs.length}
            index={index}
            onChangeIndex={this.handleChangeIndex}
          />
        </div>
        <div className="house-info">
          <h3 className="house-info-title">{house.title}</h3>
          <List className="house-info-person">
            <List.Item className={`row ${scoped.className}`} arrow="horizontal">
              <ImgProxy
                src={house.imgs[0]}
                circle
                className={`avatar ${scoped.className}`}
              />
            </List.Item>
          </List>
        </div>
        <style jsx>{`
          body {
            background: #fff;
          }
          .house {
            &-info {
              padding: 0 20px;
            }
          }
          .carousel {
            position: relative;
          }
        `}</style>
        {scoped.styles}
      </div>
    );
  }
}

export default HouseDetail;
