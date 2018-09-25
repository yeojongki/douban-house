import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import SvgIcon from 'comp/SvgIcon';
import { resolveScopedStyles } from '@/util';
import { AjaxLogin } from '@/api';

const scoped = resolveScopedStyles(
  <scope>
    <style jsx>{`
      .form-item-icon {
        position: absolute;
        left: 15px;
        bottom: 24px;
      }
    `}</style>
  </scope>
);

class Login extends Component {
  constructor() {
    super();
    this.state = {
      activeItem: null,
      form: {}
    };
  }

  // input focus
  handleFocus = field => {
    this.setState({ activeItem: field });
  };

  // input blur
  handleBlur = () => {
    this.setState({ activeItem: null });
  };

  // input change
  handleChange = (field, e) => {
    this.setState({
      form: { ...this.state.form, [field]: e.target.value }
    });
  };

  // form submit
  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state.form;
    if (!username) {
      Toast.show('请输入用户名');
      return;
    }
    if (!password) {
      Toast.show('请输入密码');
      return;
    }
    Toast.loading('登录中...', 0);
    AjaxLogin(this.state.form)
      .then(res => {
        console.log(res);
        Toast.show('登录成功');
      })
      .catch(() => {
        setTimeout(() => Toast.hide(), 1500);
      });
  };
  render() {
    return (
      <div className="login">
        <h1 className="login-title">豆瓣租房</h1>
        <form className="login-form">
          <div
            className={`form-item ${
              this.state.activeItem === 'username' ? 'active' : ''
            }`}
          >
            <span>用户名</span>
            <SvgIcon
              name="people"
              className={`form-item-icon ${scoped.className}`}
            />
            <input
              type="text"
              placeholder="请输入用户名"
              onInput={e => this.handleChange('username', e)}
              onFocus={() => this.handleFocus('username')}
              onBlur={this.handleBlur}
            />
            <div className="form-item-line" />
          </div>
          <div
            className={`form-item ${
              this.state.activeItem === 'password' ? 'active' : ''
            }`}
          >
            <span>密码</span>
            <SvgIcon
              name="lock"
              className={`form-item-icon ${scoped.className}`}
            />
            <input
              ref={ref => (this.pwdRef = ref)}
              type="password"
              placeholder="请输入密码"
              onInput={e => this.handleChange('password', e)}
              onFocus={() => this.handleFocus('password')}
              onBlur={this.handleBlur}
            />
            <div className="form-item-line" />
          </div>
          <div className="form-btn-wrap">
            <div className="form-btn-outer">
              <div className="form-btn-bg" />
              <button
                className="form-btn-inner"
                onClick={e => this.handleSubmit(e)}
              >
                登 录
              </button>
            </div>
          </div>
        </form>
        <style jsx>{`
          @import '../styles/index.scss';
          $form-item-h: 70px;
          $line-color-active: #945af1;
          /* prettier-ignore */
          $line-h: 2PX;
          .login {
            min-height: 100vh;
            background: #fff;
            &-title {
              text-align: center;
              padding-top: 200px;
              margin-top: 0;
              opacity: 0.5;
            }
            &-form {
              padding: 100px 60px 0;
              .form {
                &-item {
                  position: relative;
                  /* prettier-ignore */
                  border-bottom: $line-h solid #d9d9d9;
                  margin-bottom: 40px;
                  &.active {
                    color: $line-color-active;
                  }
                  input {
                    box-sizing: border-box;
                    display: block;
                    outline: none;
                    border: none;
                    width: 100%;
                    padding: 30px 0 30px 80px;
                    margin-top: 15px;
                    &:focus {
                      + .form-item-line {
                        width: 100%;
                      }
                    }
                  }
                  &-line {
                    position: absolute;
                    /* prettier-ignore */
                    bottom: -2PX;
                    width: 0;
                    height: $line-h;
                    background: $line-color-active;
                    transition: all 0.5s;
                  }
                }
                &-btn {
                  &-wrap {
                    margin-top: 100px;
                  }
                  &-outer {
                    width: 100%;
                    display: block;
                    position: relative;
                    z-index: 1;
                    border-radius: 50px;
                    overflow: hidden;
                    margin: 0 auto;
                    box-shadow: 0 5px 30px 0px rgba(3, 216, 222, 0.2);
                  }
                  &-bg {
                    position: absolute;
                    z-index: -1;
                    width: 300%;
                    height: 100%;
                    background: -webkit-linear-gradient(
                      right,
                      #00dbde,
                      #fc00ff,
                      #00dbde,
                      #fc00ff
                    );
                  }
                  &-inner {
                    outline: none;
                    border: none;
                    background: transparent;
                    color: #fff;
                    /* prettier-ignore */
                    font-size: 16PX;
                    padding: 0 20px;
                    width: 100%;
                    @include lheihgt();
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

export default Login;
