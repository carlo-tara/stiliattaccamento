// fs-utils.js
// Utility condivise per script di build/inject

const { readdirSync, statSync } = require('fs');
const { join, extname } = require('path');

/**
 * @param {string} dir
 * @param {string[]} [fileList]
 * @param {{ excludeDirs?: string[] }} [options]
 * @returns {string[]}
 */
function getAllHTMLFiles(dir, fileList = [], options = {}) {
  const excludeDirs = options.excludeDirs || ['templates'];

  readdirSync(dir).forEach((file) => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      if (!excludeDirs.includes(file)) {
        getAllHTMLFiles(filePath, fileList, options);
      }
    } else if (extname(file) === '.html') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

module.exports = { getAllHTMLFiles };
