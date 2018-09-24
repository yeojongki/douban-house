// style-jsx method
export function resolveScopedStyles(scope) {
  return {
    className: scope.props.className, // 就是被styled-jsx添加的独特className
    styles: scope.props.children // 就是style，需要注入到组件中
  };
}

// set sessionStorage/localStorge
export const setStorageByKey = (key, value, type = 's') => {
  let t = type === 's' ? 'sessionStorage' : 'localStorage';
  try {
    value = JSON.stringify(value);
    window[t].setItem(key, value);
  } catch (e) {
    console.error(`JSON stringify storage error, key is <${key}>`);
  }
};

// get sessionStorage/localStorge by key
export const getStorageByKey = (key, type = 's') => {
  let t = type === 's' ? 'sessionStorage' : 'localStorage';
  let result = window[t].getItem(key);
  if (result) {
    try {
      result = JSON.parse(result);
    } catch (e) {
      console.error(`JSON parse storage error, key is <${key}>`);
    }
  }
  return result;
};

// crypto value
export const sha1 = val =>
  require('crypto')
    .createHash('sha1')
    .update(val)
    .digest('hex');
