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
        display: inline-block;
        margin-right: 15px;
        float: left;
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
          <h3 className="house-info-title">
            {house.title}
            <div className="block-line" />
          </h3>
          <List className={`house-info-person ${scoped.className}`}>
            <List.Item className={`row ${scoped.className}`} arrow="horizontal">
              <ImgProxy
                src={house.imgs[0]}
                className={`avatar ${scoped.className}`}
              />
              <div className="name-wrap">
                <span>{house.author}</span>
                <span>{house.ltime}</span>
              </div>
            </List.Item>
          </List>
        </div>
        <style jsx>{`
          .house {
            height: 100vh;
            background: #fff;
            &-info {
              padding: 0 20px;
              &-title {
                position: relative;
                margin: 0;
                padding: 20px 0 0 15px;
                .block-line {
                  position: absolute;
                  width: 100%;
                  height: 2px;
                  background-color: #fff;
                  margin-left: -20px;
                  bottom: -2px;
                  z-index: 2;
                }
              }
              .name-wrap {
                display: flex;
                flex-direction: column;
                justify-content: center;
                float: left;
                font-size: 14px;
                margin-top: 5px;
              }
            }
          }
          .carousel {
            position: relative;
            min-height: 450px;
          }
        `}</style>
        {scoped.styles}
      </div>
    );
  }
}

export default HouseDetail;
