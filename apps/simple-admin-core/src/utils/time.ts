export function dateStr(unix: number) {
  const date = new Date(unix);
  // 获取js 时间戳
  let time = Date.now();
  // 去掉 js 时间戳后三位
  time = Math.floor((time - date.getTime()) / 1000);
  // 存储转换值
  let s;
  if (time < 60 * 3) {
    // 3分钟内
    return '刚刚';
  } else if (time < 60 * 60 && time >= 60 * 3) {
    // 超过3分钟少于1小时
    s = Math.floor(time / 60);
    return `${s}分钟前`;
  } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
    // 超过1小时少于24小时
    s = Math.floor(time / 60 / 60);
    return `${s}小时前`;
  } else if (time < 60 * 60 * 24 * 30 && time >= 60 * 60 * 24) {
    // 超过1天少于30天内
    s = Math.floor(time / 60 / 60 / 24);
    return `${s}天前`;
  } else {
    // 超过30天ddd
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
}
