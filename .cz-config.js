module.exports = {
  types: [
    {
      value: 'feat',
      name: 'feat:        A new feature',
    },
    {
      value: 'fix',
      name: 'fix:         A bug fix',
    },
    {
      value: 'refactor',
      name: 'refactor:    A change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'docs',
      name: 'docs:        Documentation only changes',
    },
    {
      value: 'style',
      name: 'style:       Changes that do not affect the meaning of the code\n                 (white-space, formatting, missing semi-colons, etc)',
    },
    {
      value: 'chore',
      name: 'chore:       Changes to the build process or auxiliary tools\n                and libraries such as documentation generation',
    },
    {
      value: 'ci',
      name: 'ci:          Changes to CI configuration file',
    },
    {
      value: 'perf',
      name: 'perf:        A change that improves performance',
    },
    {
      value: 'test',
      name: 'test:        Adding missing tests or correcting existing tests',
    },
    {
      value: 'revert',
      name: 'revert:      Revert to a commit',
    },
    {
      value: 'merge',
      name: 'merge:      Merge from master',
    },
  ],
  upperCaseSubject: false,
  useEmoji: true,
  scopes: [
    'root',
    'website',
    '@juxio/cli',
    '@juxio/core',
    '@juxio/design-tokens',
    '@juxio/postcss',
    '@juxio/css',
    '@juxio/react-styled',
  ],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
};
