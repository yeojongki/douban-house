import React, { Component } from 'react';
import { Menu, Icon } from 'antd-mobile';
import { resolveScopedStyles } from '@/util';
import { menu1, menu2, menu3, menu4 } from '@/util/filterMenuItem';
import SvgIcon from 'comp/SvgIcon';

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
      },
      areaText: null,
      typeText: null,
      moneyText: null
    };
  }
  handleFilterClick(type) {
    let { show } = this.state;
    for (let key in show) {
      if (key !== type) {
        show[key] = false;
      }
    }
    this.props.open();
    this.setState({
      show: Object.assign(show, { [type]: true })
    });
  }

  // set menu show to `false`
  reset() {
    this.setState({
      show: Object.assign({}, this._initShow)
    });
  }

  // select menu change event
  onChange = (type, v) => {
    let label;
    switch (type) {
      case 'area':
        menu1.forEach(item => {
          // area handler
          if (item.value === 'area') {
            item.children.forEach(cItem => {
              if (v[1] === cItem.label) {
                label = cItem.label;
                return;
              }
            });
            return;
          } else if (item.value === 'subway') {
            item.children.forEach(cItem => {
              if (v[1] === cItem.value) {
                label = cItem.label;
                return;
              }
            });
          }
        });
        label === '不限'
          ? this.setState({ areaText: '区域' })
          : this.setState({ areaText: label });
        break;
      case 'type':
        menu2.forEach(item => {
          // type handler
          if (item.value === v[0]) {
            label = item.label;
            return;
          }
        });
        label === '不限'
          ? this.setState({ typeText: '出租类型' })
          : this.setState({ typeText: label });
        break;
      case 'money':
        menu3.forEach(item => {
          // type handler
          if (item.value === v[0]) {
            label = item.label;
            return;
          }
        });
        label === '不限'
          ? this.setState({ moneyText: '租金' })
          : this.setState({ moneyText: label });
        break;
      case 'sort':
        this.sortText = 'select';
        break;

      default:
        break;
    }
    this.props.change(type, v);
    this.reset();
  };

  // filter menus mask click
  onMaskClick = () => {
    this.reset();
    this.props.close();
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
          @import '../styles/variables.scss';
          .mymenu {
            visibility: hidden;
            position: absolute;
            left: -9999px;
            &.show {
              visibility: visible;
              position: static;
            }
          }
          .filter-h-item.active {
            .icon-arrow {
            }
          }
          .icon-arrow {
            vertical-align: middle;
            width: 24px;
            height: 24px;
            transition: transform 0.3s;
            transform-origin: center center;
            &.active {
              transform: rotate(180deg);
            }
          }
        `}</style>
      </scope>
    );
    const {
      show: { area, type, money, sort },
      areaText,
      typeText,
      moneyText
    } = this.state;
    return (
      <div className="filter">
        <div className="filter-h flexbox">
          <div
            className={`filter-h-item ${area || areaText ? 'active' : ''}`}
            onClick={() => this.handleFilterClick('area')}
          >
            {this.state.areaText || '区域'}
            <Icon
              type="down"
              className={`icon-arrow  ${area ? 'active' : ''} ${
                scoped.className
              }`}
            />
          </div>
          <div
            className={`filter-h-item type ${type || typeText ? 'active' : ''}`}
            onClick={() => this.handleFilterClick('type')}
          >
            {this.state.typeText || '出租类型'}
            <Icon
              type="down"
              className={`icon-arrow ${type ? 'active' : ''} ${
                scoped.className
              }`}
            />
          </div>
          <div
            className={`filter-h-item ${money || moneyText ? 'active' : ''}`}
            onClick={() => this.handleFilterClick('money')}
          >
            {this.state.moneyText || '租金'}
            <Icon
              type="down"
              className={`icon-arrow ${money ? 'active' : ''} ${
                scoped.className
              }`}
            />
          </div>
          <div
            className={`filter-h-item sort ${sort ? 'active' : ''}`}
            onClick={() => this.handleFilterClick('sort')}
          >
            <SvgIcon
              name="paixu"
              width="14"
              height="14"
              color={this.sortText ? '#108ee9' : null}
            />
          </div>
        </div>
        <div className="filter-b">
          <div className="filter-b-item">
            <Menu
              className={`mymenu ${scoped.className} ${
                this.checkShow('area') ? 'show' : ''
              }`}
              data={menu1}
              onChange={v => this.onChange('area', v)}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height={document.documentElement.clientHeight * 0.55}
            />
          </div>
          <div className="filter-b-item">
            <Menu
              className={`mymenu ${scoped.className} ${
                this.checkShow('type') ? 'show' : ''
              }`}
              data={menu2}
              level={1}
              onChange={v => this.onChange('type', v)}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height="auto"
            />
          </div>
          <div className="filter-b-item">
            <Menu
              className={`mymenu ${scoped.className} ${
                this.checkShow('money') ? 'show' : ''
              }`}
              data={menu3}
              level={1}
              onChange={v => this.onChange('money', v)}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height="auto"
            />
          </div>
          <div className="filter-b-item sort">
            <Menu
              className={`mymenu ${scoped.className} ${
                this.checkShow('sort') ? 'show' : ''
              }`}
              data={menu4}
              level={1}
              onChange={v => this.onChange('sort', v)}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height="auto"
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
                flex: 2;
                text-align: center;
                &.sort {
                  flex: 1;
                }
                &.active {
                  color: $main-color;
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
