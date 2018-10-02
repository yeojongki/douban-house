import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd-mobile';
import { setSelectedMenu } from '@/store/actions/houseList';
import { resolveScopedStyles } from '@/util';
import { menu1, menu2, menu3, menu4 } from '@/util/filterMenuItem';
import SvgIcon from 'comp/SvgIcon';

// 用于还原状态
const initShow = {
  area: false,
  type: false,
  money: false,
  sort: false
};

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: {
        area: false,
        type: false,
        money: false,
        sort: false
      },
      areaText: props.selectedMenu[0] && props.selectedMenu[0].label,
      typeText: props.selectedMenu[1] && props.selectedMenu[1].label,
      moneyText: props.selectedMenu[2] && props.selectedMenu[2].label,
      sortText: props.selectedMenu[3] && props.selectedMenu[3].label
    };
  }

  // 筛选菜单点击
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

  // 重置还原状态为false
  reset() {
    this.setState({
      show: Object.assign({}, initShow)
    });
  }

  // 菜单下拉选择事件
  onChange = (type, v) => {
    let label;
    switch (type) {
      case 'area':
        menu1.forEach(item => {
          // 处理区域
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
        this.handleSetMenu(0, { label: label, value: v });
        break;
      case 'type':
        menu2.forEach(item => {
          // 处理出租类型
          if (item.value === v[0]) {
            label = item.label;
            return;
          }
        });
        label === '不限'
          ? this.setState({ typeText: '出租类型' })
          : this.setState({ typeText: label });
        this.handleSetMenu(1, { label: label, value: v });
        break;
      case 'money':
        menu3.forEach(item => {
          // 处理租金
          if (item.value === v[0]) {
            label = item.label;
            return;
          }
        });
        label === '不限'
          ? this.setState({ moneyText: '租金' })
          : this.setState({ moneyText: label });
        this.handleSetMenu(2, { label: label, value: v });
        break;
      case 'sort':
        this.sortText = 'select';
        this.handleSetMenu(3, { label: 'sortText', value: v });
        break;

      default:
        break;
    }
    this.props.change(type, v);
    this.reset();
  };

  // 下拉菜单mask点击关闭
  onMaskClick = () => {
    this.reset();
    this.props.close();
  };

  // 检查是否有下拉菜单打开
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

  // 设置redux下拉菜单
  handleSetMenu(index, item) {
    const { dispatch, selectedMenu } = this.props;
    let curMenu = selectedMenu.slice();
    curMenu[index] = item;
    dispatch(setSelectedMenu(curMenu));
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
      moneyText,
      sortText
    } = this.state;

    const { selectedMenu } = this.props;
    return (
      <div className="filter" ref={this.props.filterRef}>
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
            className={`filter-h-item sort ${sort || sortText ? 'active' : ''}`}
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
              value={selectedMenu[0] && selectedMenu[0].value}
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
              value={selectedMenu[1] && selectedMenu[1].value}
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
              value={selectedMenu[2] && selectedMenu[2].value}
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
              value={selectedMenu[3] && selectedMenu[3].value}
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
              z-index: 10;
              width: 100%;
              &-item {
                position: absolute;
                z-index: 10;
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
            z-index: 9;
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

const mapStateToProps = state => ({
  selectedMenu: state.houseList.selectedMenu
});
export default connect(mapStateToProps)(Filters);
