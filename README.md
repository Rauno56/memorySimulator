memorySimulator
===============

AngularJS app that simulates memory management

Install
======
Just download or clone the repo. Everything is included.

Run
===
Open the index.html file in the browser. As simple as that.

App
===

Theres 5 sections:

1. __Visualization__: The most upper green one is it. The brown-red boxes represent the processes. Every box contains it's id(i), starting place(s) and size(z).
2. __Setting__: There's only one, hence the singular form. Additional tweaks can be made in the `js/index.js` file in the first 10 rows. There's total memory size, and blocksize. Try them out.
3. __Try__: For manually manipulating the memory - add or remove the processes anytime.
4. __Play__: The main part. First there is few premade patterns and then a box for you to insert one. Patterns are semicolon-separated(`;`) list of comma-separated(`,`) pairs of size(blocks) and duration(simulation worksteps) of the process. In every step one process is added.
5. __Errors__: Let's you know if something didn't fit quite right. Clicking on them does magic.
