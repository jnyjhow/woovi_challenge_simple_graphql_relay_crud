# Woovi Challenge

## Installation

```
yarn
```

## Running

Set up generated files:

```
yarn run update-schema
yarn run build
```

Start a local server:

```
yarn run start
```

### Após isso, acessar o seguinte link:

```
http://localhost:3000/
```

## Developing

Any changes you make to files in the `js/` directory will cause the server to
automatically rebuild the app and refresh your browser.

If at any time you make changes to `data/schema.js`, stop the server,
regenerate `data/schema.graphql`, and restart the server:

```
yarn run update-schema
yarn run build
yarn run start
```
