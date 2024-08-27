# Usage

  <!-- usage -->

```sh-session
$ npm install -g @juxio/cli
$ jux COMMAND
running command...
$ jux (--version|-v|version)
@juxio/cli/0.6.5 linux-x64 node-v20.16.0
$ jux --help [COMMAND]
USAGE
  $ jux COMMAND
...
```

<!-- usagestop -->

# Commands

  <!-- commands -->

- [`jux generate`](#jux-generate)
- [`jux help [COMMAND]`](#jux-help-command)
- [`jux init`](#jux-init)
- [`jux login`](#jux-login)
- [`jux pull components`](#jux-pull-components)
- [`jux pull tokens`](#jux-pull-tokens)
- [`jux version`](#jux-version)

## `jux generate`

Generate type definitions

```
USAGE
  $ jux generate [--tokensOnly] [--cwd <value>]

FLAGS
  --cwd=<value>  [default: /home/runner/work/toolkit/toolkit/packages/cli] The current working directory for the command
  --tokensOnly   Generate tokens definitions only

DESCRIPTION
  Generate type definitions

EXAMPLES
  $ jux generate

  $ jux generate --tokens-only
```

_See code: [src/commands/generate.ts](https://github.com/jux-io/toolkit/tree/%40juxio/cli%400.6.5/packages/cli/src/commands/generate.ts)_

## `jux help [COMMAND]`

Display help for jux.

```
USAGE
  $ jux help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for jux.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/tree/%40juxio/cli%406.2.6/packages/cli/src/commands/help.ts)_

## `jux init`

initialize your project and install dependencies

```
USAGE
  $ jux init [--cwd <value>] [-f] [--skip-deps]

FLAGS
  -f, --force        Force overwrite of existing configuration
      --cwd=<value>  [default: /home/runner/work/toolkit/toolkit/packages/cli] The directory to initialize the project
                     in
      --skip-deps    Do not install dependencies

DESCRIPTION
  initialize your project and install dependencies

EXAMPLES
  $ jux init

  $ jux init --force
```

_See code: [src/commands/init.ts](https://github.com/jux-io/toolkit/tree/%40juxio/cli%400.6.5/packages/cli/src/commands/init.ts)_

## `jux login`

Authenticate CLI with a Jux account

```
USAGE
  $ jux login [-d] [-c <value>]

FLAGS
  -c, --cwd=<value>  [default: /home/runner/work/toolkit/toolkit/packages/cli] The directory to initialize the project
                     in
  -d, --defaults     Use defaults configurations

DESCRIPTION
  Authenticate CLI with a Jux account

EXAMPLES
  $ jux login -d
```

_See code: [src/commands/login.ts](https://github.com/jux-io/toolkit/tree/%40juxio/cli%400.6.5/packages/cli/src/commands/login.ts)_

## `jux pull components`

Pull components from Jux editor

```
USAGE
  $ jux pull components [-c <value>...] [--cwd <value>]

FLAGS
  -c, --components=<value>...  Pull specific components. Separate multiple components with a space.
      --cwd=<value>            [default: /home/runner/work/toolkit/toolkit/packages/cli] The current working directory
                               for the command

DESCRIPTION
  Pull components from Jux editor

EXAMPLES
  $ jux pull components -c component1 component2 component3

  $ jux pull components --all
```

_See code: [src/commands/pull/components.ts](https://github.com/jux-io/toolkit/tree/%40juxio/cli%400.6.5/packages/cli/src/commands/pull/components.ts)_

## `jux pull tokens`

Pull tokens from Jux editor

```
USAGE
  $ jux pull tokens [-d] [-c <value>]

FLAGS
  -c, --cwd=<value>  [default: /home/runner/work/toolkit/toolkit/packages/cli] The current working directory for the
                     command
  -d, --definitions  Generate token definitions after pull

DESCRIPTION
  Pull tokens from Jux editor

EXAMPLES
  $ jux pull tokens

  $ jux pull tokens -d
```

_See code: [src/commands/pull/tokens.ts](https://github.com/jux-io/toolkit/tree/%40juxio/cli%400.6.5/packages/cli/src/commands/pull/tokens.ts)_

## `jux version`

```
USAGE
  $ jux version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/tree/%40juxio/cli%402.2.10/packages/cli/src/commands/version.ts)_

<!-- commandsstop -->

# Table of contents

  <!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
- [Table of contents](#table-of-contents)
<!-- tocstop -->
