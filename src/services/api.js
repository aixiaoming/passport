import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function appList(params) {
  return request(`/app/applications?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function deleteApp(params) {
  return request('/app/applications', {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}


export async function addApp(params) {
  return request('/app/applications', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateApp(params) {
  return request('/app/applications', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}

export async function updateToken(params) {
  return request('/app/applications/token', {
    method: 'PATCH',
    body: {
      ...params,
      method: 'patch',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login', {
    method: 'POST',
    body: params,
  });
}

export async function logout() {
  return request('/api/users/logout', {
    method: 'POST',
  });
}


export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
