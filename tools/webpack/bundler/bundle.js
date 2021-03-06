const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;

/**
 * @description 分析引入模块文件
 * @param {string} filename 
 */
const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  //将代码分析生成抽象语法树
  const ast = parser.parse(content, {
    sourceType: 'module',
  });
  //存储文件的依赖关系 相对路径 和绝对路径
  const dependencies = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const newFile = './' + path.join(dirname, node.source.value);
      dependencies[node.source.value] = newFile;
    }
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  });
  // console.log(code);
  return {
    filename,
    dependencies,
    code,
  }
  // console.log(ast.program.body);
}
/**
 * 分析所有模块依赖关系
 * @param {string} entry 
 * @return {Object}
 */
const makeDependenciesGraph = (entry) => {
  const entryModule = moduleAnalyser(entry);
  const graphArry = [entryModule];
  for (let i = 0; i < graphArry.length; i++) {
    const item = graphArry[i];
    const { dependencies } = item;
    if (dependencies) {
      for (let j in dependencies) {
        graphArry.push(moduleAnalyser(dependencies[j]))
      }
    }
  }
  const graph = {}
  graphArry.forEach(({ filename, dependencies, code }) => {
    graph[filename] = {
      dependencies,
      code
    }
  });
  return graph;
}
//转换生成代码
const generateCode = (entry) => {
  const graph = JSON.stringify(makeDependenciesGraph(entry));
  return `
  (function(graph){
    function require(module) { 
      function localRequire(relativePath) {
        return require(graph[module].dependencies[relativePath]);
      }
      var exports = {};
      (function(require, exports, code){
        eval(code)
      })(localRequire, exports, graph[module].code);
      return exports;
    };
    require('${entry}')
  })(${graph});
`;
}
const code = generateCode('./src/index.js');
console.log(code);
