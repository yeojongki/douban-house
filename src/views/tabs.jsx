import React from 'react';
import { withRouter } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import TabHouseList from 'comp/tabHouseList';
import TabMine from 'comp/tabMine';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'listTab',
      hidden: false
    };
    this.navToSearch = this.navToSearch.bind(this);
  }

  navToSearch() {
    this.props.history.push('/search');
  }

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
            icon={
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  background:
                    'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat'
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  background:
                    'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat'
                }}
              />
            }
            selected={this.state.selectedTab === 'listTab'}
            badge={1}
            onPress={() => {
              this.setState({
                selectedTab: 'listTab'
              });
            }}
          >
            <TabHouseList navToSearch={this.navToSearch} />
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  background:
                    'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat'
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  background:
                    'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat'
                }}
              />
            }
            title="我的"
            key="mineTab"
            badge={'new'}
            selected={this.state.selectedTab === 'mineTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'mineTab'
              });
            }}
          >
            <TabMine />
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

export default withRouter(Tabs);
// export default props => <header>{props.children}</header>;
