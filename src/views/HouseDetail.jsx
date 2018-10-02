import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { List, Toast, Modal } from 'antd-mobile';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Pagination from 'comp/Pagination';
import Button from 'comp/Button';
import WarnTips from 'comp/WarnTips';
import { GetHouseById, UserLikeHouse } from '@/api';
import LazyImage from 'comp/LazyImage';
import SvgIcon from 'comp/SvgIcon';
import { resolveScopedStyles } from '@/util';

const douban_prefix = `https://www.douban.com/group/topic/`;
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const scoped = resolveScopedStyles(
  <scope>
    <style jsx>{`
      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: block;
        margin-right: 15px;
        float: left;
      }
      .center-icon {
        margin: 0 auto;
      }
      .like {
        &-btn {
          margin-right: 40px;
          &::before {
            border: none !important;
          }
        }
        &-icon {
          margin-top: -0.2em;
          margin-right: 0.5em;
        }
      }
    `}</style>
  </scope>
);

class HouseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      house: {
        imgs: []
      },
      isLike: false
    };
  }

  handleChangeIndex = index => {
    this.setState({
      index
    });
  };

  componentDidMount() {
    GetHouseById(this.props.match.params.id).then(res => {
      if (res && res.code === 1) {
        this.setState({
          house: res.data.house,
          isLike: res.data.isLike
        });
      }
    });
  }

  // 点击喜欢获取取消喜欢
  handleLike = () => {
    const { isLogin, history } = this.props;
    if (isLogin) {
      const tid = this.props.match.params.id;
      let { isLike } = this.state;
      UserLikeHouse(tid, isLike).then(res => {
        if (res && res.code === 1) {
          this.setState({ isLike: !isLike }, () => Toast.show(res.msg, 1));
        }
      });
    } else {
      history.push('/login');
    }
  };

  render() {
    let { house, index, isLike } = this.state;
    const Alert = Modal.alert;
    return (
      <div className="house">
        <section className="house-carousel">
          {house.imgs.length ? (
            <Fragment>
              <AutoPlaySwipeableViews
                resistance
                index={index}
                onChangeIndex={this.handleChangeIndex}
              >
                {house.imgs.map(i => (
                  <LazyImage src={i} key={i} />
                ))}
              </AutoPlaySwipeableViews>
              <Pagination
                dots={house.imgs.length}
                index={index}
                onChangeIndex={this.handleChangeIndex}
              />
            </Fragment>
          ) : (
            <LazyImage />
          )}
        </section>

        <section className="house-info">
          <h3 className="house-info-title">
            {house.title}
            <div className="block-line" />
          </h3>

          <List className={`house-info-person ${scoped.className}`}>
            <List.Item className={`row ${scoped.className}`} arrow="horizontal">
              <LazyImage
                src={house.userface}
                className={`avatar ${scoped.className}`}
              />
              <div className="name-wrap">
                <span>{house.author}</span>
                <span>{house.ctime}</span>
              </div>
            </List.Item>
          </List>

          <div className="house-info-detail flexbox">
            <div className="item size flexbox">
              {house.model ? (
                <h4 onClick={() => Toast.show(house.model)}>{house.model}</h4>
              ) : (
                <h4>暂无</h4>
              )}
              <span>房型</span>
            </div>
            <div className="item area flexbox">
              <h4>{house.size || '暂无'}</h4>
              <span>总面积</span>
            </div>
            <div className="item money flexbox">
              <h4>{house.price || '暂无'}</h4>
              <span>价格</span>
            </div>
          </div>
        </section>
        <section className="house-origin">{house.content}</section>

        <div className="border1px" />
        <WarnTips />

        <footer className="house-ft flexbox">
          <div className="border1px" />
          <div className="ft-item left flexbox">
            <div className="ft-item-wx flexbox">
              <SvgIcon
                name="wechat"
                width="20"
                height="20"
                className={`center-icon ${scoped.className}`}
              />
              <p
                onClick={() => {
                  if (
                    house.contact &&
                    house.contact.type === 'wechat' &&
                    house.contact.value
                  ) {
                    return Alert('微信', house.contact.value);
                  } else {
                    return Toast.show('暂无');
                  }
                }}
              >
                微信
              </p>
            </div>
            <div className="ft-item-phone flexbox">
              <SvgIcon
                name="phone"
                width="22"
                height="22"
                className={`center-icon ${scoped.className}`}
              />
              <p>
                {house.contact &&
                house.contact.type &&
                (house.contact.type === 'phone' ||
                  house.contact.type === 'mobile') ? (
                  <a href={`tel:${house.contact.value}`}>电话</a>
                ) : (
                  <span onClick={() => Toast.show('暂无')}>电话</span>
                )}
              </p>
            </div>
          </div>
          <div className="ft-item flexbox right">
            <Button
              color="red"
              borderColor="red"
              mRight="15"
              className={`like-btn ${scoped.className}`}
              onClick={this.handleLike}
            >
              <SvgIcon
                name={isLike ? 'like_fill' : 'like'}
                width="18"
                height="18"
                className={`like-icon ${scoped.className}`}
              />
              {isLike ? '取消' : '喜欢'}
            </Button>
            <Button
              color="#108ee9"
              borderColor="#108ee9"
              onClick={() =>
                (window.location.href = `${douban_prefix + house.tid}`)
              }
            >
              <SvgIcon
                name="plane"
                width="18"
                height="18"
                className={`like-icon ${scoped.className}`}
              />
              原贴
            </Button>
          </div>
        </footer>
        <style jsx>{`
          @import '../styles/mixins.scss';
          .house {
            box-sizing: border-box;
            min-height: 100vh;
            background: #fff;
            padding-bottom: 150px;
            &-carousel {
              position: relative;
              min-height: 450px;
            }
            &-info {
              padding: 0 20px;
              &-title {
                position: relative;
                margin: 0;
                padding: 20px 0 0 15px;
                .block-line {
                  position: absolute;
                  width: 100%;
                  /* prettier-ignore*/
                  height: 2PX;
                  background-color: #fff;
                  margin-left: -20px;
                  /* prettier-ignore*/
                  bottom: -2PX;
                  z-index: 2;
                }
              }
              &-detail {
                .item {
                  flex: 1;
                  max-width: 33.33%;
                  text-align: center;
                  flex-direction: column;
                  h4 {
                    /* prettier-ignore*/
                    font-size: 18PX;
                    margin: 20px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  span {
                    color: darkgray;
                  }
                  &.money {
                    h4 {
                      color: red;
                    }
                  }
                }
              }
              .name-wrap {
                display: flex;
                flex-direction: column;
                justify-content: center;
                float: left;
                /* prettier-ignore*/
                font-size: 14PX;
              }
            }
            &-origin {
              padding: 25px;
            }
            &-ft {
              box-sizing: border-box;
              position: fixed;
              bottom: 0;
              width: 100%;
              background: #fff;
              padding: 20px;
              .ft-item {
                &.left {
                  flex: 1;
                }
                &.right {
                  flex: 2;
                  align-items: center;
                  justify-content: flex-end;
                  padding-right: 30px;
                }
                &-wx,
                &-phone {
                  flex-direction: column;
                  justify-content: center;
                  flex: 1;
                  p,
                  svg {
                    margin: 0 auto;
                  }
                }
              }
            }
          }
        `}</style>
        {scoped.styles}
      </div>
    );
  }
}

const mapStateToProps = state => ({ isLogin: Boolean(state.user.token) });

export default connect(mapStateToProps)(HouseDetail);
