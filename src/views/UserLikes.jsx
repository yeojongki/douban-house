import React from 'react';
import { SwipeAction, Toast } from 'antd-mobile';
import { Item as HouseItem } from 'comp/House';
import Empty from 'comp/Empty';
import { GetUserLikeList, UserLikeHouse } from '@/api';

class UserLikeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    GetUserLikeList().then(res => {
      if (res && res.code === 1) {
        this.setState({ list: res.data });
      }
    });
  }

  // 用户删除喜欢
  handleUnlike = tid => {
    UserLikeHouse(tid, true).then(res => {
      if (res && res.code) {
        Toast.show(res.msg, 1);
        this.updateList(tid);
      }
    });
  };

  // 操作完后setState
  updateList(tid) {
    let list = this.state.list.slice();
    let index = list.findIndex(item => item.tid === tid);
    if (index > -1) {
      list.splice(index, 1);
    }
    this.setState({ list });
  }

  render() {
    const { list } = this.state;
    const ListItem = house => (
      <SwipeAction
        key={house.tid}
        autoClose
        right={[
          {
            text: 'Cancel',
            style: { backgroundColor: '#ddd', color: 'white' }
          },
          {
            text: 'Delete',
            onPress: () => this.handleUnlike(house.tid),
            style: { backgroundColor: '#F4333C', color: 'white' }
          }
        ]}
      >
        <HouseItem house={house} />
      </SwipeAction>
    );

    return list && list.length ? (
      list.map(item => ListItem(item))
    ) : (
      <Empty text="暂时没有喜欢哦~" />
    );
  }
}

export default UserLikeList;
