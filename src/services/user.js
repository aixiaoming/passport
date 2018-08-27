import request from '../utils/request';

export async function query() {
  return JSON.parse(localStorage.getItem('user'));
}

export async function queryCurrent() {
  return JSON.parse(localStorage.getItem('user'));
}


export async function changePassword(params) {
  return request('/api/users/password', {
    method: 'PATCH',
    body: params,
  });
}

export async function updateUser(params) {
  return request('/api/users', {
    method: 'PUT',
    body: params,
  });
}

export async function getUser() {
  return request(`/api/users?api_token=${JSON.parse(localStorage.getItem('token'))}`, {
    method: 'GET',
  });
}