# Vue Meta Examples

## Prepare examples

To prepare the examples to run locally, please follow these steps:

```bash
git clone https://github.com/nuxt/vue-meta
cd examples
yarn install
```

## Run the examples

When the examples are installed locally, start the example server as follows

```js
yarn start
// or
HOST=0.0.0.0 PORT=8080 yarn start
```
and browse to `http://localhost:3000` or whatever you changed the host and port to

### SSR Example

The server side rendering example is available on the cli only, to run the SSR example just run

```bash
yarn ssr
```

## Developing

If you would like to use the examples while developing or debugging `vue-meta` features or issues, please do as follows

```js
git clone https://github.com/nuxt/vue-meta
yarn install
cd examples
yarn install
yarn dev
```
