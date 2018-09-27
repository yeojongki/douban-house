import React from 'react';
import CanvasBg from 'comp/CanvasBg';

export default class About extends React.Component {
  render() {
    return (
      <div className="about">
        <CanvasBg />
        <div
          className="about-box"
          style={{
            transform: 'translate(-100%,-50%) scale(.5)',
            opacity: '0',
            transition: 'all 1s'
          }}
        >
          <ul className="ul">
            <li>关于项目：一个租房小应用（仅供学习使用）</li>
            <li>
              关于技术栈:
              <ul>
                <li>前端：React</li>
                <li>后端：Koa</li>
                <li>数据库：MongoDB</li>
              </ul>
            </li>
            <li>关于我：一个96年前端小菜鸟</li>
          </ul>
        </div>
        <style jsx>{`
          .about {
            display: table;
            text-align: center;
            min-height: 90vh;
            color: #424242;
            .about-box {
              display: table-cell;
              vertical-align: middle;
              padding: 0 80px;
              opacity: 1 !important;
              transform: translate(0, 0) scale(1) !important;
              .ul {
                margin: 0;
                text-align: left;
                padding-left: 80px;
                li {
                  line-height: 1.8;
                }
              }
            }
          }
        `}</style>
      </div>
    );
  }
}
