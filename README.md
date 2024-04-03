# tree-structure

Versatile and feature-rich TypeScript library with the capability to calculate x and y positions for objects represented in a tree structure while ensuring avoidance of relationship crossings.

| \*  | Version   | Supported          |
| --- | --------- | ------------------ |
| npm | >= 7.24.0 | :white_check_mark: |

# main features

Library provides class which will calculate position of object (x, y) with the following rules:

1. Objects are calculated into groups (where separate groups do not have relationships to each other)
2. Groups are places (horizontally position) or (vertically position) based on property
3. Each groups are separated by space which is customized
4. Groups are places from left-right where left is the biggest group (horizontally position) or top-bottom where top is the biggest group (vertically position)
5. Each groups root object is the one which with no parent
6. Each object within group are separated by space which is customized
7. Each parent object is centered among its children
8. Height and width of each object can be different
9. Each new row (horizontally position) will start where last row ended (after biggest child height) or each new column (vertical position) will start where last column ended (after biggest child width)

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

![alt text](https://github.com/piratuks/tree-structure/blob/main/object_example_horizontal.png?raw=true)

# vertical example

![alt text](https://github.com/piratuks/tree-structure/blob/main/object_example_vertical.png?raw=true)

## installation

```bash
$ npm install --save tree-structure
```

## usage

After installation, the only thing you need to do is require the module:

```bash
import { TreeStructure } from 'tree-structure';
```

or

```bash
const { TreeStructure } = require('tree-structure');
```

## run example

- To run example locally it is required to run `npm i` for both projects ([example](example) and [core](core))
- After `npm i` need to run `npm run build` within [core](core)
- Then need to run `npm link` within [core](core)
- Then run `npm link tree-structure` within [example](example)
- Everything is ready and you can perform `npm run start` within [example](example) which will auto generate index.html (open it via browser to see results) 

### Tests

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
