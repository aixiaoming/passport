import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
  state = {

  };


  render() {
    return (
      <div>欢迎来到首页</div>
    );
  }
}
