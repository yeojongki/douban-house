import React, { Component } from 'react';
import { Menu } from 'antd-mobile';

const data = [
  {
    value: '1',
    label: '区域',
    children: [
      {
        label: '不限',
        value: '1'
      },
      {
        label: '天河',
        value: '2'
      },
      {
        label: '越秀',
        value: '3'
      },
      {
        label: '荔湾',
        value: '4'
      },
      {
        label: '海珠',
        value: '5'
      },
      {
        label: '番禺',
        value: '6'
      },
      {
        label: '白云',
        value: '7'
      },
      {
        label: '黄埔',
        value: '8'
      },
      {
        label: '从化',
        value: '9'
      },
      {
        label: '增城',
        value: '10'
      },
      {
        label: '花都',
        value: '11'
      },
      {
        label: '南沙',
        value: '12'
      }
    ]
  },
  {
    value: '2',
    label: '地铁',
    children: [
      {
        label: '1号线',
        value: '1'
      },
      {
        label: '2号线',
        value: '2'
      },
      {
        label: '3号线',
        value: '3'
      },
      {
        label: '4号线',
        value: '4'
      },
      {
        label: '5号线',
        value: '5'
      },
      {
        label: '6号线',
        value: '6'
      },
      {
        label: '7号线',
        value: '7'
      },
      {
        label: '8号线',
        value: '8'
      },
      {
        label: '9号线',
        value: '9'
      },
      {
        label: '13号线',
        value: '13'
      },
      {
        label: '14号线',
        value: '14'
      },
      {
        label: 'apm线',
        value: 'APM'
      },
      {
        label: '广佛线',
        value: '广佛线'
      }
    ]
  }
];
class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }
  handleFilterClick(type) {
    console.log(type);
    this.setState({
      show: !this.state.show
    });
    this.props.fixHeader();
  }
  onChange = v => {
    console.log(v);
  };
  onMaskClick = () => {
    this.setState({
      show: !this.state.show
    });
  };
  render() {
    const { show } = this.state;
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
              data={data}
              onChange={this.onChange}
              onOk={this.onOk}
              onCancel={this.onCancel}
              height={document.documentElement.clientHeight * 0.6}
            />
          </div>
          <div className="filter-b-item" />
          <div className="filter-b-item" />
          <div className="filter-b-item" />
        </div>
        {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
        <style jsx>{`
          .filter-b-item {
            position: absolute;
            z-index: 80 !important;
            width: 100%;
          }
          .filter {
            &-h {
              padding: 15px 0;
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
          .menu-mask {
            position: absolute;
            top: 50%;
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: 0.4;
            z-index: 79;
          }
        `}</style>
      </div>
    );
  }
}
export default Filters;
