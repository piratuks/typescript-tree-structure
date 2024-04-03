# typescript-tree-structure

Versatile and feature-rich TypeScript library with the capability to calculate x and y positions for objects represented in a tree structure while ensuring avoidance of relationship crossings.

| \*  | Version   | Supported          |
| --- | --------- | ------------------ |
| npm | >= 7.24.0 | :white_check_mark: |

# main features

The library provides a class which will calculate the position of the object (x, y) with the following rules:

1. Objects are calculated into groups (where separate groups do not have relationships with each other)
2. Groups are places (horizontally position) or (vertically position) based on property
3. Each group are separated by space which is customized
4. Groups are places from left-right where left is the biggest group (horizontal position) or top-bottom where the top is the biggest group (vertical position)
5. Each group root object is the one with no parent
6. Each object within the group is separated by space which is customized
7. Each parent object is centred among its children
8. The height and width of each object can be different
9. Each new row (horizontal position) will start where the last row ended (after the biggest child height) or each new column (vertical position) will start where the last column ended (after the biggest child width)

So for example containing objects: a, b, c, d, e, i, i1, g, h, k, k1, k2, k3, k4, l, l1, l2, l3, l4, l5, h1, h2, h3

a -> has children: b, c, d, e <br/>
e -> has children: i, g, l3 <br/>
b -> has children: h <br/>
c -> has children: k <br/>
i -> has children: i1, l4 <br/>
k -> has children: k1, k2 <br/> 
k1 -> has children: k3, k4 <br/>
h -> has children: h1, h2 <br/>
h1 -> has children: h2, h3 <br/>
l -> has children: l1, l5 <br/>

# horizontal example

![alt text](https://github.com/piratuks/typescript-tree-structure/blob/main/object_example_horizontal.png?raw=true)

# vertical example

![alt text](https://github.com/piratuks/typescript-tree-structure/blob/main/object_example_vertical.png?raw=true)

## installation

```bash
$ npm install --save typescript-tree-structure
```

## usage

After installation, the only thing you need to do is require the module:

```bash
import { TreeStructure } from 'typescript-tree-structure';
```

or

```bash
const { TreeStructure } = require('typescript-tree-structure');
```

## run example

- To run example locally it is required to run `npm i` for both projects ([example](https://github.com/piratuks/typescript-tree-structure/tree/main/example) and [core](https://github.com/piratuks/typescript-tree-structure/tree/main/core))
- After `npm i` need to run `npm run build` within [core](https://github.com/piratuks/typescript-tree-structure/tree/main/core)
- Then need to run `npm link` within [core](https://github.com/piratuks/typescript-tree-structure/tree/main/core)
- Then run `npm link typescript-tree-structure` within [example](https://github.com/piratuks/typescript-tree-structure/tree/main/example)
- Everything is ready and you can perform `npm run start` within [example](https://github.com/piratuks/typescript-tree-structure/tree/main/example) which will auto generate index.html (open it via browser to see results) 

## Tests

This module is well-tested. You can run:

`npm run test` to run the tests under Node.js.
<br/>
`npm run test:nyc` to run the tests under Node.js and get the coverage

Tests are not included in the npm package. If you want to play with them, you must clone the GitHub repository.

## contributing

Please read our [Contribution Guidelines](CONTRIBUTING.md) before contributing to this project.

## security

Please read our [SECURITY REPORTS](SECURITY.md)

## license

[MIT](LICENSE)
