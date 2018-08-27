import React, {PureComponent} from 'react';
import {connect} from 'dva';
import { Form, Input, Button, Alert, Col } from 'antd';
import styles from './UserInfo.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@connect(({user, loading}) => ({
  user,
  submitting: loading.effects['user/info'],
  loading: loading.effects['user/getInfo'],
}))
@Form.create()
export default class UserInfo extends PureComponent {

  componentDidMount() {
    console.log('componentDidMount');
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getInfo',
      payload: {

      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'user/info',
          payload: {
            ...values,
          },
        });
      }
    });
  };


  renderMessage = (type, content) => {
    return (
      <FormItem {...submitFormLayout}>
        <Alert style={{ marginBottom: 24 }} message={content} type={type} showIcon />
      </FormItem>
    );
  };


  render() {
    const { user, form, submitting } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          {console.log(user)}
          {user.status !== 200 && user.update &&
          user.status !== undefined &&
          !submitting &&
          this.renderMessage('error', user.message)}

          {user.status === 200 && user.update &&
          this.renderMessage('success', user.message)}

          <FormItem {...formItemLayout} label="昵称">
            {getFieldDecorator('username', {
              initialValue: user.currentUser && user.currentUser.username,
              rules: [
                {
                  required: true,
                  message: '请输入昵称',
                },
              ],
            })(<Input placeholder="请输入昵称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: user.currentUser && user.currentUser.email,
              rules: [
                {
                  required: true,
                  message: '请输入邮箱',
                },
                { type: 'email', message: '邮箱格式不正确' },
              ],
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="头像链接">
            {getFieldDecorator('avatar', {
              initialValue: user.currentUser && user.currentUser.avatar,
              rules: [
                {
                  required: true,
                  message: '请输入头像链接',
                },
              ],
            })(<Input placeholder="请输入头像链接" />)}
          </FormItem>

          <FormItem {...submitFormLayout}>
            <Button
              size="large"
              loading={submitting}
              type="primary"
              htmlType="submit"
            >
              修改个人信息
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}