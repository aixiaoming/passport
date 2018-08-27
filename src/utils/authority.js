// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  if (getcookie('accessToken')) {
      return 'admin';
  }
}

export function setAuthority(authority) {
  setCookie('accessToken', authority.accessToken, authority.token && authority.token.expires_at);
  localStorage.setItem('accessToken', JSON.stringify(authority.accessToken));
  localStorage.setItem('tokenInfo', JSON.stringify(authority.token));
  localStorage.setItem('user', JSON.stringify(authority.user));
  return localStorage.setItem('antd-pro-authority', JSON.stringify('admin'));
}

/**
 * 设置cookie
 * @param {*} name 
 * @param {*} value 
 * @param {*} date 
 */
function setCookie(name, value, date)
{
    const exp = new Date(date);    // new Date("December 31, 9998");
    exp.setTime(exp.getTime());
    document.cookie = `${name}=${value};expires=${exp.toGMTString()};domain=.aiblogs.cn`;
    // domain=.aiblogs.com
}

function getcookie(name){
  const strcookie = document.cookie;
  const arrcookie = strcookie.split(';');
  for(let i = 0; i < arrcookie.length; i += 1){
    const arr = arrcookie[i].split('=');
    if(arr[0] === name)
    return arr[1];
  }
  return "";
}