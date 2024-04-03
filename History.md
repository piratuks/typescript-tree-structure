# tree-structure

## 2024-04-03, version 1.0.1

Initial release with the following functionality

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
