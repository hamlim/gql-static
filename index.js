/*
Plan:

1. Generate schema based on directory structure
2. Find doc-query.js files and execute their query export
3. return the resolved data as doc-data.js as a main export
4. Drop all the data into a top level components-data.js file


*/

// 1
import dirTree from 'directory-tree'

const COMPONENTS = ['./components']

const [schema, directory] = COMPONENTS.reduce(
  ([schema, directory], componentPath) => {
    const tree = dirTree(componentPath)
    return [
      {
        ...schema,
        componentPath: treeToSchema(tree),
      },
      {
        ...directory,
        componentPath: tree,
      },
    ]
  },
  [{}, {}],
)

console.log(directory)
