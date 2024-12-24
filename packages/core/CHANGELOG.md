# @juxio/core

## 0.8.9

### Patch Changes

- [#131](https://github.com/jux-io/toolkit/pull/131) [`2880757`](https://github.com/jux-io/toolkit/commit/28807574096f5a5f067d1498009286abdeaa1124) Thanks [@metav-drimz](https://github.com/metav-drimz)! - Radio primitive

- Updated dependencies [[`2880757`](https://github.com/jux-io/toolkit/commit/28807574096f5a5f067d1498009286abdeaa1124)]:
  - @juxio/design-tokens@0.8.9

## 0.8.8

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.8.8

## 0.8.7

### Patch Changes

- [#126](https://github.com/jux-io/toolkit/pull/126) [`8ec73da`](https://github.com/jux-io/toolkit/commit/8ec73dae783f54aeabd193eb184ccc1afb014ad7) Thanks [@metav-drimz](https://github.com/metav-drimz)! - added Toggle primitive & Checkbox forwardRef fix

- Updated dependencies [[`8ec73da`](https://github.com/jux-io/toolkit/commit/8ec73dae783f54aeabd193eb184ccc1afb014ad7)]:
  - @juxio/design-tokens@0.8.7

## 0.8.6

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.8.6

## 0.8.5

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.8.5

## 0.8.4

### Patch Changes

- Updated dependencies [[`7451f4b`](https://github.com/jux-io/toolkit/commit/7451f4be8e74a6a47a25c3e8ed67ab78d92e173f)]:
  - @juxio/design-tokens@0.8.4

## 0.8.3

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.8.3

## 0.8.2

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.8.2

## 0.8.1

### Patch Changes

- [#108](https://github.com/jux-io/toolkit/pull/108) [`812e00d`](https://github.com/jux-io/toolkit/commit/812e00d25aa1f2f0e77d1bb19e4d8737a75fad7a) Thanks [@hamatoyogi](https://github.com/hamatoyogi)! - fix(@juxio/core): fix font import injection position in css file

- Updated dependencies []:
  - @juxio/design-tokens@0.8.1

## 0.8.0

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.8.0

## 0.7.8

### Patch Changes

- [#101](https://github.com/jux-io/toolkit/pull/101) [`2dbcc61`](https://github.com/jux-io/toolkit/commit/2dbcc617eafc47d8756ee94ff58eec5e78a30376) Thanks [@tnipri](https://github.com/tnipri)! - updated environment variable of api server

- Updated dependencies [[`2dbcc61`](https://github.com/jux-io/toolkit/commit/2dbcc617eafc47d8756ee94ff58eec5e78a30376)]:
  - @juxio/design-tokens@0.7.8

## 0.7.7

### Patch Changes

- [#99](https://github.com/jux-io/toolkit/pull/99) [`a0d151f`](https://github.com/jux-io/toolkit/commit/a0d151f43012a230efc756be9366514d1d7199de) Thanks [@tnipri](https://github.com/tnipri)! - modified code generation api

- Updated dependencies []:
  - @juxio/design-tokens@0.7.7

## 0.7.6

### Patch Changes

- [#92](https://github.com/jux-io/toolkit/pull/92) [`4524779`](https://github.com/jux-io/toolkit/commit/4524779b9149d6732dc523838928cd71e5e478c8) Thanks [@tnipri](https://github.com/tnipri)! - Typescript issues:
  - fixed typing issue with \_name property when using css or styled function
  - \_name will not be included in the final css output when NODE_ENV is production. This is great for debugging classes in development mode.
  - Changed :where to :is for better browser support and specificity of styles applied to variants
- Updated dependencies []:
  - @juxio/design-tokens@0.7.6

## 0.7.5

### Patch Changes

- [#87](https://github.com/jux-io/toolkit/pull/87) [`f231136`](https://github.com/jux-io/toolkit/commit/f23113611dd0a9d0d256ee7cf500d652629975d0) Thanks [@tnipri](https://github.com/tnipri)! - modified data-jux-theme to data-jux and made it more generic

- Updated dependencies []:
  - @juxio/design-tokens@0.7.5

## 0.7.4

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.7.4

## 0.7.3

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.7.3

## 0.7.2

### Patch Changes

- [#81](https://github.com/jux-io/toolkit/pull/81) [`e5aa102`](https://github.com/jux-io/toolkit/commit/e5aa10295da345f7c3e812e52e9948ab1ad75664) Thanks [@tnipri](https://github.com/tnipri)! - bump version

- Updated dependencies []:
  - @juxio/design-tokens@0.7.2

## 0.7.1

### Patch Changes

- [#77](https://github.com/jux-io/toolkit/pull/77) [`f886abf`](https://github.com/jux-io/toolkit/commit/f886abf7f41c5f4fe41f3c008fe952ed1633f01b) Thanks [@tnipri](https://github.com/tnipri)! - added support for cjs and mjs config files

- Updated dependencies []:
  - @juxio/design-tokens@0.7.1

## 0.7.0

### Minor Changes

- [#73](https://github.com/jux-io/toolkit/pull/73) [`6c0bffe`](https://github.com/jux-io/toolkit/commit/6c0bffec652473d385a40fc4ce27733290c6c96e) Thanks [@tnipri](https://github.com/tnipri)! - added utilities field to cli config

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

- [#73](https://github.com/jux-io/toolkit/pull/73) [`6c0bffe`](https://github.com/jux-io/toolkit/commit/6c0bffec652473d385a40fc4ce27733290c6c96e) Thanks [@tnipri](https://github.com/tnipri)! - added screens field to cli config

  ```typescript
  export default defineConfig({
    // ...
    screens: {
      desktop: {
        max: '1920px',
        min: '1024px',
      }, // => @media (min-width: 1024px) and (max-width: 1920px)
      mobile: '1024px', // => @media (min-width: 1024px)
    },
  });
  ```

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.7.0

## 0.6.13

### Patch Changes

- Updated dependencies [[`219c7e1`](https://github.com/jux-io/toolkit/commit/219c7e1d6db547ca15f267d1ab0fb199c7527c4a)]:
  - @juxio/design-tokens@0.6.13

## 0.6.12

### Patch Changes

- [#63](https://github.com/jux-io/toolkit/pull/63) [`cf9eae0`](https://github.com/jux-io/toolkit/commit/cf9eae02e5bd56d5b719b0e5e087aacdd6368c08) Thanks [@tnipri](https://github.com/tnipri)! - fixed an issue with astro and css function

- Updated dependencies []:
  - @juxio/design-tokens@0.6.12

## 0.6.11

### Patch Changes

- [#61](https://github.com/jux-io/toolkit/pull/61) [`1ac8024`](https://github.com/jux-io/toolkit/commit/1ac80247606a2cd334359b042e2a6eb2ef909fbf) Thanks [@tnipri](https://github.com/tnipri)! - added native support for astro files

- Updated dependencies []:
  - @juxio/design-tokens@0.6.11

## 0.6.10

### Patch Changes

- [#58](https://github.com/jux-io/toolkit/pull/58) [`2d5011c`](https://github.com/jux-io/toolkit/commit/2d5011ce3fb7393bacc17b35ce01bc3f7c8a3296) Thanks [@tnipri](https://github.com/tnipri)! - added postcss flag to cli, to enable creation of postcss.config.js file

  fixed an issue where changes in styled function did not reflect it on the page

- Updated dependencies []:
  - @juxio/design-tokens@0.6.10

## 0.6.9

### Patch Changes

- [#56](https://github.com/jux-io/toolkit/pull/56) [`d8019ae`](https://github.com/jux-io/toolkit/commit/d8019ae08a2a141449a1ccbf0b1e4875342fa8d3) Thanks [@tnipri](https://github.com/tnipri)! - separated css function from styled to its own package

- Updated dependencies []:
  - @juxio/design-tokens@0.6.9

## 0.6.8

### Patch Changes

- [#52](https://github.com/jux-io/toolkit/pull/52) [`86e8b3d`](https://github.com/jux-io/toolkit/commit/86e8b3d72f25921013728a8b8d8bc8973c503689) Thanks [@tnipri](https://github.com/tnipri)! - improved error logging on some cases

- Updated dependencies []:
  - @juxio/design-tokens@0.6.8

## 0.6.7

### Patch Changes

- [#49](https://github.com/jux-io/toolkit/pull/49) [`545ce15`](https://github.com/jux-io/toolkit/commit/545ce15c3f146d631a0595463b5044d0ad27ce4a) Thanks [@tnipri](https://github.com/tnipri)! - fixed various bugs that came up from tests

- Updated dependencies [[`545ce15`](https://github.com/jux-io/toolkit/commit/545ce15c3f146d631a0595463b5044d0ad27ce4a)]:
  - @juxio/design-tokens@0.6.7

## 0.6.6

### Patch Changes

- [#45](https://github.com/jux-io/toolkit/pull/45) [`ae488e3`](https://github.com/jux-io/toolkit/commit/ae488e3056855780364419c011829cf9480bfbe3) Thanks [@tnipri](https://github.com/tnipri)! - fixed an issue where using minimal configurations caused unnecessary exception

- [#47](https://github.com/jux-io/toolkit/pull/47) [`7ee29ce`](https://github.com/jux-io/toolkit/commit/7ee29cef496e2ff629a37d94df9a1c0571a6c737) Thanks [@tnipri](https://github.com/tnipri)! - components command no longer pull tokens when pulling components

- Updated dependencies []:
  - @juxio/design-tokens@0.6.6

## 0.6.5

### Patch Changes

- [#43](https://github.com/jux-io/toolkit/pull/43) [`f345677`](https://github.com/jux-io/toolkit/commit/f345677f37a835e8a08684384fa0e8b65a45881e) Thanks [@tnipri](https://github.com/tnipri)! - fixed an issue where token type generation underscored the output

- Updated dependencies []:
  - @juxio/design-tokens@0.6.5

## 0.6.4

### Patch Changes

- [#41](https://github.com/jux-io/toolkit/pull/41) [`a859940`](https://github.com/jux-io/toolkit/commit/a8599401b00216c3e36d69feb74892a4a2502111) Thanks [@tnipri](https://github.com/tnipri)! - fixed a bug with invalid characters in css variable names

- [#41](https://github.com/jux-io/toolkit/pull/41) [`7602856`](https://github.com/jux-io/toolkit/commit/76028566a0277babd65325579da613971fbb2344) Thanks [@tnipri](https://github.com/tnipri)! - upgraded react dependency which caused type issues in some projects

- Updated dependencies []:
  - @juxio/design-tokens@0.6.4

## 0.6.3

### Patch Changes

- [#39](https://github.com/jux-io/toolkit/pull/39) [`9a634ef`](https://github.com/jux-io/toolkit/commit/9a634efe1df7d5ccac1d98868e870bb195ff0a15) Thanks [@tnipri](https://github.com/tnipri)! - fixed a bug with invalid characters in css variable names

- Updated dependencies []:
  - @juxio/design-tokens@0.6.3

## 0.6.2

### Patch Changes

- [#37](https://github.com/jux-io/toolkit/pull/37) [`f14f8a9`](https://github.com/jux-io/toolkit/commit/f14f8a92a03c8811ec91f767b388ae295d300fcb) Thanks [@tnipri](https://github.com/tnipri)! - fixed an issue where zod provides an error while definitions_directory is undefined

- Updated dependencies []:
  - @juxio/design-tokens@0.6.2

## 0.6.1

### Patch Changes

- Updated dependencies [[`c9b6a03`](https://github.com/jux-io/toolkit/commit/c9b6a03ba4207a9b85d75ab5c21cc2b565b1c7e4)]:
  - @juxio/design-tokens@0.6.1

## 0.6.0

### Minor Changes

- [#33](https://github.com/jux-io/toolkit/pull/33) [`abd4f7a`](https://github.com/jux-io/toolkit/commit/abd4f7a118d80145b33694077855c4ad51bf842f) Thanks [@tnipri](https://github.com/tnipri)! - added presets to jux config

### Patch Changes

- [#33](https://github.com/jux-io/toolkit/pull/33) [`7c8f933`](https://github.com/jux-io/toolkit/commit/7c8f933b47d2627a1602779ea7cd54396d36a335) Thanks [@tnipri](https://github.com/tnipri)! - added browserlist support in jux config

- [#33](https://github.com/jux-io/toolkit/pull/33) [`4b084cb`](https://github.com/jux-io/toolkit/commit/4b084cb90680a918c485813baf1916d12aceaeaf) Thanks [@tnipri](https://github.com/tnipri)! - performance improvements

- [#33](https://github.com/jux-io/toolkit/pull/33) [`647afa3`](https://github.com/jux-io/toolkit/commit/647afa3f991883c63017d93058507107ac879731) Thanks [@tnipri](https://github.com/tnipri)! - bug fix and improvements:
  - replaced nanocss with lightningcss
  - fixed an issue where variables names were not transformed correctly on react styled and css functions
- Updated dependencies []:
  - @juxio/design-tokens@0.6.0

## 0.5.7

### Patch Changes

- [`fdef145`](https://github.com/jux-io/toolkit/commit/fdef145d179d23f46f04e26c0858001addc23e2e) Thanks [@tnipri](https://github.com/tnipri)! - tokens output from pull command is now prettified

- [`a8d091f`](https://github.com/jux-io/toolkit/commit/a8d091fd4e6afa826b5ff247f29dc1d5ba744af0) Thanks [@tnipri](https://github.com/tnipri)! - added meaningful error messages once CLI API communication fails

- [`0b36d04`](https://github.com/jux-io/toolkit/commit/0b36d04e70e543fc351cf4085963cee492a3d10c) Thanks [@tnipri](https://github.com/tnipri)! - Added two main changes:

  - CLI will now install react-styled library on init
  - Added 'no-deps' flag to init command, which will not install any dependencies

- Updated dependencies []:
  - @juxio/design-tokens@0.5.7

## 0.5.6

### Patch Changes

- [#28](https://github.com/jux-io/toolkit/pull/28) [`edf3be4`](https://github.com/jux-io/toolkit/commit/edf3be40aa988cd13e6dd6a4582f8298ced9c870) Thanks [@tnipri](https://github.com/tnipri)! - fixed an issue where using groupBy function caused CLI to crash

- Updated dependencies []:
  - @juxio/design-tokens@0.5.6

## 0.5.5

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.5.5

## 0.5.4

### Patch Changes

- [#24](https://github.com/jux-io/toolkit/pull/24) [`dbe0501`](https://github.com/jux-io/toolkit/commit/dbe0501368f45387a0cdad3453f644e5323cb351) Thanks [@tnipri](https://github.com/tnipri)! - modified package json to contain homepage and repository

- Updated dependencies [[`dbe0501`](https://github.com/jux-io/toolkit/commit/dbe0501368f45387a0cdad3453f644e5323cb351)]:
  - @juxio/design-tokens@0.5.4

## 0.5.3

### Patch Changes

- Updated dependencies []:
  - @juxio/design-tokens@0.5.3

## 0.5.2

### Patch Changes

- [#20](https://github.com/jux-io/toolkit/pull/20) [`5d9cd03`](https://github.com/jux-io/toolkit/commit/5d9cd03e29f2ed62340541b95ca4e1ed6b1605fb) Thanks [@tnipri](https://github.com/tnipri)! - - added version command to cli
  - fixed an issue where the cli installs invalid packages on init
- Updated dependencies []:
  - @juxio/design-tokens@0.5.2

## 0.5.1

### Patch Changes

- [#17](https://github.com/jux-io/toolkit/pull/17) [`50c50d2`](https://github.com/jux-io/toolkit/commit/50c50d252cbf48884d467eb09fe6c90acd19e4fa) Thanks [@tnipri](https://github.com/tnipri)! - fixed an issue where jux init failed
  improved caching mechanism for better performance during development
- Updated dependencies []:
  - @juxio/design-tokens@0.5.1

## 0.5.0

### Minor Changes

- [#13](https://github.com/jux-io/toolkit/pull/13) [`17f50bd`](https://github.com/jux-io/toolkit/commit/17f50bd61b769fd6e32bb0b21a7e74ad5edddbe6) Thanks [@tnipri](https://github.com/tnipri)! - Added css optimizations and styled function improvements

### Patch Changes

- Updated dependencies [[`17f50bd`](https://github.com/jux-io/toolkit/commit/17f50bd61b769fd6e32bb0b21a7e74ad5edddbe6)]:
  - @juxio/design-tokens@0.5.0
