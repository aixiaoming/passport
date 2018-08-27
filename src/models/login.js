import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, logout } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);

      yield put({
          type: 'changeLoginStatus',
          payload: response,
      });

      // Login successfully
      if (response.status_code === 200) {
        // reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
       

        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            currentAuthority: 'admin',
          },
        });

        // if (redirect) {
        //   console.log(39, redirect);
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.startsWith('/#')) {
        //       redirect = redirect.substr(2);
        //     }
        //   } else {
        //       console.log(47, redirect);
        //     window.location.href = redirect;
        //     return;
        //   }
        // }

        yield put(
            routerRedux.push({
                pathname: '/dashboard/analysis',
                search: stringify({
                    redirect: window.location.href,
                }),
            })
        );
        
        // yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { put, call }) {
      const response = yield call(logout);
      localStorage.clear();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      // reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.status_code === 200) {
        setAuthority(payload.data);
        reloadAuthorized();
      }

      return {
        ...state,
        status: payload.status_code,
        message: payload.message,
      };
    },
  },
};
