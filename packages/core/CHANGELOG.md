# @juxio/core

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
