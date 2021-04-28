const fs = require('fs');
const path = require('path');

// 判断 File 存在且是 Folder
const isDirExist = (filePath) => {
  try {
    const stat = fs.existsSync(filePath) && fs.statSync(filePath);

    return stat && stat.isDirectory();
  }catch (_) {
    return false;
  }

};

const parseEntryFile = (pkgPath) => {
    const jsonFile = path.join(pkgPath, 'package.json');
    return fs.existsSync(jsonFile) ? require(jsonFile).main : '';
};

// windows 文件路径问题
const formatFilePath = (filePath) => {
  const sep = path.sep;
    if (sep === '/') {
        return filePath;
    } else {
        return filePath.replace(/\\/g, '/');
    }
};

module.exports = {
  isDirExist,
  parseEntryFile,
  formatFilePath
};
