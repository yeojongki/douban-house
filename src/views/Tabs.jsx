import React from 'react';
import { connect } from 'react-redux';
import { setActiveTab } from '@/store/actions/tab';
import { logout } from '@/store/actions/user';
import { TabBar } from 'antd-mobile';
import { HouseList, Mine } from 'comp/Tabs';
import SvgIcon from 'comp/SvgIcon';
import { setStorageByKey } from '@/util';
import Cookie from 'js-cookie';

class Tabs extends React.Component {
  navToSearch = () => {
    this.props.history.push('/search');
  };

  // tab`我的` 跳转事件
  handleNavto = (type, url) => {
    if (type === 'route') {
      this.props.history.push(url);
    } else {
      window.location.href = url;
    }
  };

  // 设置当前tab
  handleSetActiveTab = tab => {
    const { dispatch } = this.props;
    setStorageByKey('activeTab', tab);
    dispatch(setActiveTab(tab));
  };

  // 登出
  handleLogout = () => {
    Cookie.remove('token');
    const { dispatch } = this.props;
    dispatch(logout());
  };

  render() {
    const { activeTab, isLogin, username } = this.props;
    return (
      <div className="layout">
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#108ee9"
          barTintColor="white"
        >
          <TabBar.Item
            title="房源"
            key="listTab"
            icon={<SvgIcon name="homepage" />}
            selectedIcon={<SvgIcon name="homepage_fill" color="#108ee9" />}
            selected={activeTab === 'listTab'}
            onPress={() => {
              this.handleSetActiveTab('listTab');
            }}
          >
            <HouseList searchClick={this.navToSearch} />
          </TabBar.Item>
          <TabBar.Item
            icon={<SvgIcon name="mine" />}
            selectedIcon={<SvgIcon name="mine_fill" color="#108ee9" />}
            title="我的"
            key="mineTab"
            selected={activeTab === 'mineTab'}
            onPress={() => {
              this.handleSetActiveTab('mineTab');
            }}
          >
            <Mine
              logout={this.handleLogout}
              handleSetActiveTab={this.handleSetActiveTab}
              navTo={this.handleNavto}
              isLogin={isLogin}
              username={username}
            />
          </TabBar.Item>
        </TabBar>
        <style jsx>{`
          .layout {
            position: fixed;
            top: 0;
            height: 100%;
            width: 100%;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeTab: state.tab.tab,
  isLogin: Boolean(state.user.token),
  username: state.user.username
});

export default connect(mapStateToProps)(Tabs);
