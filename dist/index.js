"use strict";

var _directoryTree = _interopRequireDefault(require("directory-tree"));

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPONENTS = ['./components'];
const directory = COMPONENTS.reduce((directory, componentPath) => {
  const tree = (0, _directoryTree.default)(componentPath);
  return _objectSpread({}, directory, {
    [componentPath]: tree
  });
}, {});
console.log(directory);
const SCHEMA = (0, _graphql.buildSchema)(`
type Query {
  fileNames: [String]
}
`);

function flattenChildren(child, selector) {
  if (!child.children) {
    return [selector(child)];
  } else {
    return child.children.reduce((allChildren, child) => [...allChildren, ...flattenChildren(child, selector)], []);
  }
}

const resolvers = {
  fileNames: () => {
    return Object.keys(directory).reduce((fileNames, key) => {
      const {
        children
      } = directory[key];
      const allChildren = children.reduce((children, child) => [...children, ...flattenChildren(child, c => c.path)], []);
      return [fileNames, ...allChildren];
    }, []).filter(val => typeof val === 'string');
  }
};

const executeQuery = query => (0, _graphql.graphql)(SCHEMA, query, resolvers);

executeQuery(` { fileNames }`).then(res => {
  console.log('Res:');
  console.log(res);
});