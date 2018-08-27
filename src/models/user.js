import { query as queryUsers, queryCurrent, updateUser, getUser, changePassword } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    status: undefined,
  },

  effects: {
    *getInfo ({payload}, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'getUser',
        payload: response,
      });
    },
    *info ({payload}, { call, put }) {
      const response = yield call(updateUser, payload);
      yield put({
        type: 'updateUser',
        payload: response,
      });
    },
    *password ({payload}, { call, put }) {
      const response = yield call(changePassword, payload);
      yield put({
        type: 'changePassword',
        payload: response,
      });
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    updateUser(state, { payload }) {
      return {
        ...state,
        status: payload.status_code,
        message: payload.message,
        update: true,
      };
    },
    getUser(state, { payload }) {
      return {
        ...state,
        status: payload.status_code,
        currentUser: payload.data,
        update: false,
      };
    },
    changePassword(state, { payload }) {
      console.log(payload)
      if (payload.status_code === 200) {
        localStorage.clear();
      }

      return {
        ...state,
        status: payload.status_code,
        message: payload.message,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
