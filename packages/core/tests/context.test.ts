import { describe, it, expect } from 'vitest';
import { getConfigContext } from '../src';
import { join, resolve } from 'node:path';

const root = resolve(join(__dirname, '../'));

const cwd = join(root, 'tests', 'sample-config');

describe('Context', () => {
  it('Context loads the right styling configurations', async () => {
    const ctx = await getConfigContext({
      cwd,
    });

    await ctx.stylesheetManager.appendBaseStyles();

    expect(ctx.stylesheetManager.toCss()).toMatchSnapshot();
  });
});
