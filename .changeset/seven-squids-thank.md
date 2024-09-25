---
'@juxio/core': patch
'@juxio/css': patch
'@juxio/react-styled': patch
---

Typescript issues:
- fixed typing issue with _name property when using css or styled function
- _name will not be included in the final css output when NODE_ENV is production. This is great for debugging classes in development mode.
- Changed :where to :is for better browser support and specificity of styles applied to variants