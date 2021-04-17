const fs = require('fs');

// 保证文件一定存在，文件不存在则创建文件
const fileExist = (filePath) => {
  try {
    fs.readFileSync(filePath, 'utf-8');
  } catch (_) {
    fs.appendFileSync(filePath, '', 'utf-8');
  }
};

const isDirExist = (filePath) => {
  const stat = fs.statSync(filePath);
  return stat && stat.isDirectory();
};

module.exports = {
  fileExist,
  isDirExist
};
