import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon, Form, Select, Input} from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Option } = Select;
const InputGroup = Input.Group;
const { Tab, Password, Mobile, Captcha, Submit } = Login;
const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    ccc: '86',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { dispatch, form } = this.props;
    const { ccc } = this.state;
    const phone = form.getFieldValue('phone');
    if (!err) {
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          ccc,
          phone,
        },
      });
    }
  };

  changePrefix = value => {
      this.setState({
          ccc: value,
      });
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting, form } = this.props;
    const { getFieldDecorator } = form;
    const { type, autoLogin, ccc } = this.state;
    return (
      <div className={styles.main}>
        {console.log(login.status)}
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="手机密码登录">

            {login.status !== 200 &&
             login.status !== undefined &&
              !submitting &&
              this.renderMessage(login.message)}

            <FormItem>
              <InputGroup compact>
                <Select
                  size="large"
                  value={ccc}
                  onChange={this.changePrefix}
                  style={{ width: '20%' }}
                >
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                </Select>
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ],
                  })(<Input size="large" style={{ width: '80%' }} placeholder="请输入手机号！" />)}
              </InputGroup>
            </FormItem>
            {/* <UserName name="userName" placeholder="admin/user" /> */}
            <Password name="password" placeholder="请输入密码！" />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}
