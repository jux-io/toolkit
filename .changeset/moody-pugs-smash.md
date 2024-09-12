---
'@juxio/core': minor
---

added utilities field to cli config

```
export default defineConfig({
    // ...
    utilities: {
        mx: {
            transform(value) => {
                return {
                    marginLeft: value[0],
                    marginRight: value[0],
                }
            }
        }
    }
})
```