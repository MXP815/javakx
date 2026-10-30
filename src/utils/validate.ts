// 禁止输入空格
export function validateSpaceStr(value, resolve, reject) {
  //需要return 一个Promise对象
  // const reg = /^[\w\-@()a-zA-Z0-9\u4e00-\u9fa5]+$/;
  const reg = /^\S*$/;
  if (!reg.test(value.productName) || (!reg.test(value) && value)) {
    reject('仅支持中英文、数字、下划线、短划线、@、英文括号！');
  }
  resolve();
}
// 只能输入英文、数字、下划线
export function validateSpaceNum(value, resolve, reject) {
  //需要return 一个Promise对象
  const reg = /[^a-zA-Z0-9_]/g;
  if (reg.test(value) && value) {
    reject('仅支持英文、数字、下划线');
  }
  resolve();
}

// 只能输入英文、数字、下划线
export function validateSpace(value, resolve, reject) {
  //需要return 一个Promise对象
  const reg = /[^a-zA-Z0-9._:@-]/g;
  if (reg.test(value) && value) {
    reject('英文、数字、短划线、下划线、@、英文句号、英文冒号');
  }
  resolve();
}
// 验证手机号
export const validatePhone = (val) => {
  if (val !== undefined && val !== '') {
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

    if (!reg.test(val)) {
      return false;
    }
    if (val.length === 11) {
      return true;
    }
  }
};
// 邮箱校验
export const validateEmail = (val) => {
  if (val !== undefined && val !== '') {
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!reg.test(val)) {
      return false;
    } else {
      return true;
    }
  }
};
export const dateTime = (val) => {
  const now = new Date(val);
  // 获取月日
  const month = now.getMonth() + 1; // getMonth 返回0-11，所以需要加1
  const day = now.getDate();
  // this.currentMonthDay = `${month}月${day}日`;

  // 获取时分秒
  const hours = now.getHours().toString().padStart(2, '0'); // 确保两位数
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
};
