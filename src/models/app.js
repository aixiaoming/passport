import { queryRule, deleteApp, updateApp, updateToken, addApp, appList } from '../services/api';

export default {
  namespace: 'app',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    },
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(appList, payload);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addApp, payload);
      if (response.status_code === 200) {
        const responseList = yield call(appList);
        yield put({
          type: 'getList',
          payload: responseList,
        });
      } else {
        yield put({
          type: 'addList',
          payload: response,
        });
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateApp, payload);
      if (response.status_code === 200) {
        const responseList = yield call(appList);
        yield put({
          type: 'getList',
          payload: responseList,
        });
      } else {
        yield put({
          type: 'addList',
          payload: response,
        });
        if (callback) callback();
      }
    },
    *updateToken({ payload, callback }, { call, put }) {
      const response = yield call(updateToken, payload);
      if (response.status_code === 200) {
        const responseList = yield call(appList);
        yield put({
          type: 'getList',
          payload: responseList,
        });
      } else {
        yield put({
          type: 'addList',
          payload: response,
        });
        if (callback) callback();
      }
    },
    *deleteApps({ payload, callback }, { call, put }) {
      let response = yield call(deleteApp, payload);
       
      response = JSON.parse(response);

      if (response.status_code === 200) {
        const responseList = yield call(appList);
        yield put({
          type: 'getList',
          payload: responseList,
        });
      } else {
        yield put({
          type: 'addList',
          payload: response,
        });
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    addList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getList(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.data,
          pagination: {
            total: action.payload.data.total,
          },
        },
      };
    },
  },
};
