const postcss = require('postcss');
const { readFileSync } = require('fs-extra');

const cssText = readFileSync('index.css', 'utf-8');
postcss()
  .process(cssText, { from: 'index.css', to: 'output.css' })
  .then((result) => {
    console.log(result.css);
  });
