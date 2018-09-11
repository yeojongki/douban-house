import React, { Component } from 'react';
import { Menu, Icon } from 'antd-mobile';
import { resolveScopedStyles } from '@/util';
import { menu1, menu2, menu3, menu4 } from '@/util/filterMenuItem';

class Filters extends Component {
  constructor(props) {
    super(props);
    this._initShow = {
      area: false,
      type: false,
      money: false,
      sort: false
    };
    this.state = {
      show: {
        area: false,
        type: false,
        money: false,
        sort: false
      }
    };
  }
  handleFilterClick(type) {
    let { show } = this.state;
    for (let key in show) {
      if (key !== type) {
        show[key] = false;
      }
    }
    this.setState({
      show: Object.assign(show, { [type]: true })
    });
  }
  onChange = v => {
    console.log(v);
  };
  onMaskClick = () => {
    this.setState({
      show: Object.assign({}, this._initShow)
    });
  };
  // check if show
  checkShow(type) {
    let { show } = this.state;
    // if no type it indicates is the mask
    if (type) {
      return show[type] === true ? true : false;
    } else {
      for (let key in show) {
        if (show[key] === true) {
          return true;
        }
      }
      return false;
    }
  }
  render() {
    const scoped = resolveScopedStyles(
      <scope>
        <style jsx>{`
          .mymenu {
            visibility: hidden;
            position: absolute;
            left: -9999px;
            &.show {
              visibility: visible;
              position: static;
            }
          }
          .icon-arrow {
            vertical-align: middle;
            width: 24px;
            height: 24px;
          }
        `}</style>
      </scope>
    );
    const { area, type, money, sort } = this.state.show;
    return (
      <div className="filter">
        <div className="filter-h flexbox">
          <div
            className={`filter-h-item ${area ? 'active' : ''}`}
            onClick={() => this.handleFilterClick('area')}
          >
            区域
          </div>
          <i className="icon-wrap">
            <Icon type="down" className={`icon-arrow ${scoped.className}`} />
          </i>
          <div
            className={`filter-h-item type ${type ? 'active' : ''}`}
            onClick={() => this.handleFilterClick('type')}
          >
            出租类型
          </div>
          <i className="icon-wrap">
            <Icon type="down" className={`icon-arrow ${scoped.className}`} />
          </i>
          <div
            className={`filter-h-item ${money ? 'active' : ''}`}
            onClick={() => this.handleFilterClick('money')}
          >
            租金
          </div>
          <i className="icon-wrap">
            <Icon type="down" className={`icon-arrow ${scoped.className}`} />
          </i>
          <div
            className={`filter-h-item sort ${sort ? 'active' : ''}`}
            onClick={() => this.handleFilterClick('sort')}
          >
            icon
          </div>
        </div>
        <div className="filter-b">
          <div className="filter-b-item">
            <Menu
              className={`mymenu ${scoped.className} ${
                this.checkShow('area') ? 'show' : ''
              }`}
              data={menu1}
              onChange={this.onChange}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height={document.documentElement.clientHeight * 0.6}
            />
          </div>
          <div className="filter-b-item">
            <Menu
              className={`mymenu ${scoped.className} ${
                this.checkShow('type') ? 'show' : ''
              }`}
              data={menu2}
              level={1}
              onChange={this.onChange}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height={document.documentElement.clientHeight * 0.27}
            />
          </div>
          <div className="filter-b-item">
            <Menu
              className={`mymenu ${scoped.className} ${
                this.checkShow('money') ? 'show' : ''
              }`}
              data={menu3}
              level={1}
              onChange={this.onChange}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height={document.documentElement.clientHeight * 0.33}
            />
          </div>
          <div className="filter-b-item">
            <Menu
              className={`mymenu ${scoped.className} ${
                this.checkShow('sort') ? 'show' : ''
              }`}
              data={menu4}
              level={1}
              onChange={this.onChange}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height={document.documentElement.clientHeight * 0.27}
            />
          </div>
        </div>
        <div
          className={`menu-mask ${this.checkShow() ? 'show' : ''}`}
          onClick={this.onMaskClick}
        />
        <style jsx>{`
          @import '../styles/index.scss';
          .filter {
            &-h {
              line-height: 70px;
              background: #fff;
              &-item {
                position: relative;
                flex: 1;
                text-align: center;
                & + .icon-wrap {
                  margin-left: -80px;
                  transition: transform 0.3s;
                }
                &.type {
                  & + .icon-wrap {
                    margin-left: -50px;
                  }
                }
                &.active {
                  color: $main-color;
                  & + .icon-wrap {
                    transform: rotate(180deg);
                    transform-origin: center center;
                    color: $main-color;
                  }
                }
              }
            }
            &-b {
              position: absolute;
              z-index: 80 !important;
              width: 100%;
              &-item {
                position: absolute;
                z-index: 80 !important;
                width: 100%;
              }
            }
          }
          .menu-mask {
            position: absolute;
            top: 145px;
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: 0.4;
            z-index: 79;
            visibility: hidden;
            &.show {
              visibility: visible;
            }
          }
        `}</style>
        {scoped.styles}
      </div>
    );
  }
}
export default Filters;
