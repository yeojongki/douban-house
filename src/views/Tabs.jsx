import React from 'react';
import { TabBar } from 'antd-mobile';
import TabHouseList from 'comp/TabHouseList';
import TabMine from 'comp/TabMine';
import SvgIcon from 'comp/SvgIcon';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'listTab',
      hidden: false
    };
  }

  navToSearch = () => {
    this.props.history.push('/search');
  };

  // tab mine nav event
  handleNavto = (type, url) => {
    if (type === 'route') {
      this.props.history.push(url);
    } else {
      window.location.href = url;
    }
  };

  render() {
    return (
      <div className="layout">
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#108ee9"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="房源"
            key="listTab"
            icon={<SvgIcon name="homepage" />}
            selectedIcon={<SvgIcon name="homepage_fill" color="#108ee9" />}
            selected={this.state.selectedTab === 'listTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'listTab'
              });
            }}
          >
            <TabHouseList searchClick={this.navToSearch} />
          </TabBar.Item>
          <TabBar.Item
            icon={<SvgIcon name="mine" />}
            selectedIcon={<SvgIcon name="mine_fill" color="#108ee9" />}
            title="我的"
            key="mineTab"
            selected={this.state.selectedTab === 'mineTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'mineTab'
              });
            }}
          >
            <TabMine navTo={this.handleNavto} />
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

export default Tabs;
