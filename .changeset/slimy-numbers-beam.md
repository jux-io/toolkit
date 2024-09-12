---
'@juxio/core': minor
---

added screens field to cli config

```typescript
export default defineConfig({
    // ...
    screens: {
        desktop: {
            max: '1920px',
            min: '1024px'
        }, // => @media (min-width: 1024px) and (max-width: 1920px)
        mobile: '1024px' // => @media (min-width: 1024px)
    }
})
```