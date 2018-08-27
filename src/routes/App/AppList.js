import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Popconfirm,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  Table,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './AppList.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, selectRow, handleUpdate } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      
      if (err) return;
      form.resetFields();
      if (fieldsValue.id) {
        handleUpdate(fieldsValue);
      } else {
        handleAdd(fieldsValue);
      }
    });
  };
  return (
    <Modal
      title="创建应用"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {selectRow && selectRow.id && (
        <FormItem style={{display: 'none'}} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('id',{
                  initialValue: selectRow && selectRow.id,
                })(<Input placeholder="" />)}
        </FormItem>
      )}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name',{
                 initialValue: selectRow && selectRow.name,
                 rules: [{ required: true, message: '请输入应用名称' }],
              })(<Input placeholder="请输入应用名称" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ app, loading }) => ({
  app,
  loading: loading.models.app,
}))
@Form.create()
export default class AppList extends PureComponent {
  state = {
    modalVisible: false,
    selectRow: {},
    formValues: {},
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/list',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sortby = `${sorter.field}`;
      params.order = `${sorter.order}`;
    }

    dispatch({
      type: 'app/list',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'app/list',
      payload: {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'app/list',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      selectRow: {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/add',
      payload: {
        name: fields.name,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/update',
      payload: {
        name: fields.name,
        id: fields.id,
      },
    });
    
    message.success('修改成功');
    this.setState({
      modalVisible: false,
    });
  };

  updateToken = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/updateToken',
      payload: {
        id: row.id,
      },
    });
    
    message.success('修改成功');
  };

  remove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    const deletes = selectedRows.map(row => row.id);

    dispatch({
      type: 'app/deleteApps',
      payload: {
        id_array: JSON.stringify(deletes),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });

    message.success('刪除成功');
  }

  beforeUpdate = (record) => {
    this.setState({
      modalVisible: true,
      selectRow: record,
    });
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
   
    return (
     
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="应用名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
          
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      app: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, selectRow } = this.state;
    
    const columns = [
      {
        title: '应用名称',
        dataIndex: 'name',
      },
      {
        title: 'Token',
        dataIndex: 'token',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          
          <Fragment>
            <a onClick={() => this.beforeUpdate(record)}>更新應用</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要更新此應用的 Token？" onConfirm={() => this.updateToken(record)}>
              <a>更新 Token</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" className={styles.add} type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.remove()}>刪除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} selectRow={selectRow}/>
      </PageHeaderLayout>
    );
  }
}
