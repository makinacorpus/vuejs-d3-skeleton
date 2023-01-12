# A skeleton for a D3.js + Vue.js component

Find here a skeleton to boostrap a Vue.js component that will host a D3.js dataviz.

- In `./src/components/DatavizSkeleton.*` you'll find a basic non-functionnal skeleton
- In `./src/components/DatavizExample.*` you'll find a fully functionnal example

The idea of this skeleton is to:

- simplify D3.js effort by removing all unnessary code (like creating the `svg` element with D3.js)
- try to have a well-organized component (like putting most of styling in `<style>` section instead of D3.js code)
- take advantage of the Vue.js reactivity (like using computed variables when it's possible)

--

Try it out :

```sh
nvm use
yarn install
yarn dev
```