import React, { Component } from 'react';
import { Menu } from 'antd-mobile';
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
        `}</style>
      </scope>
    );
    return (
      <div className="filter">
        <div className="filter-h flexbox">
          <div
            className="filter-h-item"
            onClick={() => this.handleFilterClick('area')}
          >
            区域
          </div>
          <div
            className="filter-h-item"
            onClick={() => this.handleFilterClick('type')}
          >
            出租类型
          </div>
          <div
            className="filter-h-item"
            onClick={() => this.handleFilterClick('money')}
          >
            租金
          </div>
          <div
            className="filter-h-item sort"
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
          .filter-b-item {
            position: absolute;
            z-index: 80 !important;
            width: 100%;
          }
          .filter {
            &-h {
              line-height: 70px;
              background: #fff;
              &-item {
                flex: 2;
                text-align: center;
                &.sort {
                  flex: 1;
                }
              }
            }
            &-b {
              position: absolute;
              z-index: 80 !important;
              width: 100%;
              &-menu {
              }
            }
          }
          .mymenu {
            display: none;
            &.show {
              display: block;
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
