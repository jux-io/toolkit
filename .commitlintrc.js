module.exports = {
  extends: ['@commitlint/config-conventional'],
  // Ignore the following messages (changesets messages)
  ignores: [
    (message) =>
      message.includes('Version Packages') ||
      message.includes('chore: new release candidate'),
  ],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'chore',
        'ci',
        'refactor',
        'perf',
        'test',
        'revert',
      ],
    ],
  },
};
