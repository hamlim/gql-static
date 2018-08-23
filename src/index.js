/*
Plan:

1. Generate schema based on directory structure
2. Find doc-query.js files and execute their query export
3. return the resolved data as doc-data.js as a main export
4. Drop all the data into a top level components-data.js file


*/

// 1
import dirTree from 'directory-tree'
import { buildSchema, graphql } from 'graphql'

const COMPONENTS = ['./components']

const directory = COMPONENTS.reduce((directory, componentPath) => {
  const tree = dirTree(componentPath)
  return {
    ...directory,
    [componentPath]: tree,
  }
}, {})

console.log(directory)

const SCHEMA = buildSchema(`
type Query {
  fileNames: [String]
}
`)

function flattenChildren(child, selector) {
  if (!child.children) {
    return [selector(child)]
  } else {
    return child.children.reduce(
      (allChildren, child) => [
        ...allChildren,
        ...flattenChildren(child, selector),
      ],
      [],
    )
  }
}

const resolvers = {
  fileNames: () => {
    return Object.keys(directory)
      .reduce((fileNames, key) => {
        const { children } = directory[key]
        const allChildren = children.reduce(
          (children, child) => [
            ...children,
            ...flattenChildren(child, c => c.path),
          ],
          [],
        )

        return [fileNames, ...allChildren]
      }, [])
      .filter(val => typeof val === 'string')
  },
}

const executeQuery = query => graphql(SCHEMA, query, resolvers)

executeQuery(` { fileNames }`).then(res => {
  console.log('Res:')
  console.log(res)
})
