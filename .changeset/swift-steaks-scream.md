---
'@juxio/cli': minor
---

added --directory folder to both pull and components commands, for custom output directory

```
npx jux pull components --directory ./my-components -c my-component
```

```
npx jux pull tokens --directory ./my-components -c my-component
```