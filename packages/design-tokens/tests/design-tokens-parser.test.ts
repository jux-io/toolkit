import { describe, it, vi } from 'vitest';
import { DesignTokensParser } from '../src';
// do not change the import path, it is used for testing the mock
import { getCurrentTimestamp } from '../src/parser/helpers';

vi.mock('../src/parser/helpers', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('../src/parser/helpers')>()),
    getCurrentTimestamp: vi.fn(() => '2021-09-01T00:00:00Z'),
  };
});

describe('DesignTokensParser', () => {
  const primaryColor = '#8a4242';
  const secondaryColor = '#bd7a3b';

  const headingTypography = {
    fontFamily: 'Comic Sans MS',
    fontSize: '24px',
    fontWeight: 'bold',
  };

  const bodyTypography = {
    fontFamily: 'Helvetica',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  it('should parse tokens', () => {
    const input = {
      color: {
        primary: {
          text: {
            $type: 'color',
            $description: 'Primary text color',
            $value: primaryColor,
          },
          border: {
            $type: 'color',
            $description: 'Primary border color',
            $value: primaryColor,
          },
        },
        secondary: {
          text: {
            $type: 'color',
            $description: 'Secondary text color',
            $value: secondaryColor,
          },
          border: {
            $type: 'color',
            $description: 'Secondary border color',
            $value: secondaryColor,
          },
        },
      },
    };
    const output = {
      'color.primary.text': primaryColor,
      'color.primary.border': primaryColor,
      'color.secondary.text': secondaryColor,
      'color.secondary.border': secondaryColor,
    };
    const parser = new DesignTokensParser(input);
    const parsedTokens = parser.getValuesMap();
    expect(parsedTokens).toEqual(output);
    expect(input).toMatchSnapshot();
    expect(parsedTokens).toMatchSnapshot();
    expect(parser.getValue('color.primary.text')).toEqual(primaryColor);

    // parse a new set of tokens while nesting the original
    const newInput = {
      dark: input,
    };
    const newOutput = {
      'dark.color.primary.text': primaryColor,
      'dark.color.primary.border': primaryColor,
      'dark.color.secondary.text': secondaryColor,
      'dark.color.secondary.border': secondaryColor,
    };
    const newParsedTokens = parser.parse(newInput).getValuesMap();
    expect(newParsedTokens).toEqual(newOutput);
    expect(newInput).toMatchSnapshot();
    expect(newParsedTokens).toMatchSnapshot();
    expect(parser.getValue('dark.color.primary.text')).toEqual(primaryColor);
  });

  it('should parse tokens with aliases', () => {
    const aliasInput = {
      color: {
        primary: {
          text: {
            $description: 'Primary text color',
            $value: '{color.secondary.text}',
          },
          border: {
            $description: 'Primary border color',
            $value: '{color.secondary.border}',
          },
        },
        secondary: {
          text: {
            $type: 'color',
            $description: 'Secondary text color',
            $value: secondaryColor,
          },
          border: {
            $type: 'color',
            $description: 'Secondary border color',
            $value: secondaryColor,
          },
        },
      },
      typography: {
        heading: {
          $type: 'typography',
          $description: 'Heading typography',
          $value: headingTypography,
        },
        body: {
          $type: 'typography',
          $description: 'Body typography',
          $value: bodyTypography,
        },
        paragraph: {
          $description: 'Paragraph typography',
          $value: '{typography.body}',
        },
      },
    };
    const aliasOutput = {
      'color.primary.text': secondaryColor,
      'color.primary.border': secondaryColor,
      'color.secondary.text': secondaryColor,
      'color.secondary.border': secondaryColor,
      'typography.heading': headingTypography,
      'typography.body': bodyTypography,
      'typography.paragraph': bodyTypography,
    };
    const parser = new DesignTokensParser(aliasInput);
    const parsedAliasTokens = parser.getValuesMap();
    expect(parser.getRawValueCopy()).toEqual(aliasInput);
    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parsedAliasTokens).toEqual(aliasOutput);
    expect(parsedAliasTokens).toMatchSnapshot();
    expect(parser.getValue('color.primary.text')).toEqual(secondaryColor);
  });

  it('should set tokens and groups', () => {
    const BLACK = '#000000';
    const WHITE = '#FFFFFF';
    const input = {
      color: {
        primary: {
          test: {
            $type: 'color',
            $description: 'Primary test color',
            $value: primaryColor,
          },
        },
      },
    };
    const parser = new DesignTokensParser(input);

    // update group
    parser.setGroup({
      groupName: 'primary',
      oldName: 'primary',
      // updated description
      description: 'Primary test colors group',
      groupPath: 'color',
      allowOverwrite: true,
    });

    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValue('color.primary.test')).toEqual(primaryColor);
    expect(parser.getValue('color.secondary.test')).toEqual(undefined);
    expect(parser.getValuesMap()).toMatchSnapshot();

    // add group
    parser.setGroup({
      groupName: 'secondary',
      description: 'Secondary test colors group',
      groupPath: 'color',
    });

    // insert alias token into new group
    parser.setToken({
      tokenPath: 'color.secondary.test',
      tokenData: {
        $type: 'color',
        $value: '{color.primary.test}',
      },
    });
    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValue('color.primary.test')).toEqual(primaryColor);
    expect(parser.getValue('color.secondary.test')).toEqual(primaryColor);
    expect(parser.getValuesMap()).toMatchSnapshot();

    // update aliased token
    parser.setToken({
      tokenPath: 'color.primary.test',
      tokenData: {
        $type: 'color',
        $value: WHITE,
      },
      allowOverwrite: true,
    });
    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValue('color.primary.test')).toEqual(WHITE);
    expect(parser.getValue('color.secondary.test')).toEqual(WHITE);
    expect(parser.getValuesMap()).toMatchSnapshot();

    // change alias -> non-alias
    parser.setToken({
      tokenPath: 'color.secondary.test',
      tokenData: {
        $type: 'color',
        $value: BLACK,
      },
      allowOverwrite: true,
    });
    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValue('color.primary.test')).toEqual(WHITE);
    expect(parser.getValue('color.secondary.test')).toEqual(BLACK);
    expect(parser.getValuesMap()).toMatchSnapshot();

    // change non-alias -> alias
    parser.setToken({
      tokenPath: 'color.primary.test',
      tokenData: {
        $type: 'color',
        $value: '{color.secondary.test}',
      },
      allowOverwrite: true,
    });
    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValue('color.primary.test')).toEqual(BLACK);
    expect(parser.getValue('color.secondary.test')).toEqual(BLACK);
    expect(parser.getValuesMap()).toMatchSnapshot();

    // rename non-alias token
    parser.renameToken({
      oldPath: 'color.primary.test',
      newPath: 'color.primary.test2',
    });
    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValue('color.primary.test')).toBeUndefined();
    expect(parser.getValue('color.primary.test2')).toEqual(BLACK);
    expect(parser.getValuesMap()).toMatchSnapshot();

    // rename alias token
    parser.renameToken({
      oldPath: 'color.secondary.test',
      newPath: 'color.secondary.test2',
    });
    const renameAliasTokenJson = parser.getRawValueCopy();
    expect(renameAliasTokenJson.color.primary.test).toBeUndefined();
    expect(renameAliasTokenJson.color.primary.test2.$value).toEqual(
      '{color.secondary.test2}'
    );
    expect(renameAliasTokenJson).toMatchSnapshot();
    expect(parser.getValue('color.secondary.test')).toBeUndefined();
    expect(parser.getValue('color.secondary.test2')).toEqual(BLACK);
    expect(parser.getValuesMap()).toMatchSnapshot();
  });

  it('should support multi-level aliases', () => {
    const currentTimestamp = getCurrentTimestamp();
    const input = {
      color: {
        $extensions: {
          createdAt: currentTimestamp,
        },
        primary: {
          $extensions: {
            createdAt: currentTimestamp,
          },
          test: {
            $extensions: {
              createdAt: currentTimestamp,
            },
            $type: 'color',
            $description: 'Primary test color',
            $value: primaryColor,
          },
        },
      },
      typography: {
        $extensions: {
          createdAt: currentTimestamp,
        },
        heading: {
          $extensions: {
            createdAt: currentTimestamp,
          },
          $description: 'Heading typography group',
          h1: {
            $extensions: {
              createdAt: currentTimestamp,
            },
            $type: 'typography',
            $description: 'Heading 1 typography',
            $value: headingTypography,
          },
          h2: {
            $extensions: {
              createdAt: currentTimestamp,
            },
            $type: 'typography',
            $value: '{typography.heading.h1}',
          },
          h3: {
            $extensions: {
              createdAt: currentTimestamp,
            },
            $type: 'typography',
            $value: {
              fontFamily: '{fontFamily.primary}',
              fontWeight: '{fontWeight.primary}',
            },
          },
          h4: {
            $extensions: {
              createdAt: currentTimestamp,
            },
            $type: 'typography',
            $value: '{typography.heading.h3}',
          },
        },
        body: {
          $extensions: {
            createdAt: currentTimestamp,
          },
          $description: 'Body typography group',
          primary: {
            $extensions: {
              createdAt: currentTimestamp,
            },
            $type: 'typography',
            $value: bodyTypography,
          },
          secondary: {
            $extensions: {
              createdAt: currentTimestamp,
            },
            $type: 'typography',
            $value: '{typography.body.primary}',
          },
        },
        paragraph: {
          $extensions: {
            createdAt: currentTimestamp,
          },
          $description: 'Paragraph typography group',
          primary: {
            $extensions: {
              createdAt: currentTimestamp,
            },
            $type: 'typography',
            $value: {
              fontFamily: '{fontFamily.secondary}',
              fontWeight: '{fontWeight.secondary}',
            },
          },
        },
      },
      fontFamily: {
        $extensions: {
          createdAt: currentTimestamp,
        },
        $description: 'Font family group',
        primary: {
          $extensions: {
            createdAt: currentTimestamp,
          },
          $type: 'fontFamily',
          $value: 'Helvetica',
        },
        secondary: {
          $extensions: {
            createdAt: currentTimestamp,
          },
          $type: 'fontFamily',
          $value: '{fontFamily.primary}',
        },
      },
      fontWeight: {
        $extensions: {
          createdAt: currentTimestamp,
        },
        $description: 'Font weight group',
        primary: {
          $extensions: {
            createdAt: currentTimestamp,
          },
          $type: 'fontWeight',
          $value: 'bold',
        },
        secondary: {
          $extensions: {
            createdAt: currentTimestamp,
          },
          $type: 'fontWeight',
          $value: '{fontWeight.primary}',
        },
      },
    };

    const parser = new DesignTokensParser(input);

    expect(() => {
      // add group
      parser.setGroup({
        groupName: 'secondary',
        description: 'Secondary test colors group',
        groupPath: 'color',
      });

      // insert alias token into new group
      parser.setToken({
        tokenPath: 'color.secondary.test2',
        tokenData: {
          $type: 'color',
          $value: '{color.primary.test}',
        },
      });

      // insert 2nd-level alias token into new group
      parser.setToken({
        tokenPath: 'color.secondary.test0',
        tokenData: {
          $type: 'color',
          $value: '{color.secondary.test2}',
        },
      });

      // insert 3rd-level alias token into new group
      parser.setToken({
        tokenPath: 'color.secondary.test1',
        tokenData: {
          $type: 'color',
          $value: '{color.secondary.test0}',
        },
      });
    }).not.toThrowError();

    expect(() => {
      // insert alias token that points to a non-existing token
      parser.setToken({
        tokenPath: 'color.secondary.test3',
        tokenData: {
          $type: 'color',
          $value: '{doesnt.exist.test}',
        },
      });
    }).toThrowError();

    const expectedValuesMap = {
      'color.primary.test': '#8a4242',
      'color.secondary.test2': '#8a4242',
      'color.secondary.test0': '#8a4242',
      'color.secondary.test1': '#8a4242',
      'typography.heading.h1': {
        fontFamily: 'Comic Sans MS',
        fontSize: '24px',
        fontWeight: 'bold',
      },
      'typography.heading.h2': {
        fontFamily: 'Comic Sans MS',
        fontSize: '24px',
        fontWeight: 'bold',
      },
      'typography.heading.h3': {
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
      },
      'typography.heading.h4': {
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
      },
      'typography.body.primary': {
        fontFamily: 'Helvetica',
        fontSize: '14px',
        fontWeight: 'bold',
      },
      'typography.body.secondary': {
        fontFamily: 'Helvetica',
        fontSize: '14px',
        fontWeight: 'bold',
      },
      'typography.paragraph.primary': {
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
      },
      'fontFamily.primary': 'Helvetica',
      'fontFamily.secondary': 'Helvetica',
      'fontWeight.primary': 'bold',
      'fontWeight.secondary': 'bold',
    };

    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValuesMap()).toMatchSnapshot();
    expect(parser.getRawValueCopy()).toMatchObject(input);
    expect(parser.getValuesMap()).toEqual(expectedValuesMap);
    expect(parser.getValue('color.primary.test')).toEqual(primaryColor);
    expect(parser.getValue('color.secondary.test0')).toEqual(primaryColor);
    expect(parser.getValue('color.secondary.test1')).toEqual(primaryColor);
    expect(parser.getValue('color.secondary.test2')).toEqual(primaryColor);
    expect(parser.getValue('typography.heading.h1')).toEqual(headingTypography);
    expect(parser.getValue('typography.heading.h2')).toEqual(headingTypography);
    expect(parser.getValue('typography.heading.h3')).toEqual({
      fontFamily: 'Helvetica',
      fontWeight: 'bold',
    });
    expect(parser.getValue('typography.heading.h4')).toEqual({
      fontFamily: 'Helvetica',
      fontWeight: 'bold',
    });
    expect(parser.getValue('typography.body.primary')).toEqual(bodyTypography);
    expect(parser.getValue('typography.body.secondary')).toEqual(
      bodyTypography
    );
    expect(parser.getValue('typography.paragraph.primary')).toEqual({
      fontFamily: 'Helvetica',
      fontWeight: 'bold',
    });
    expect(parser.getValue('fontFamily.primary')).toEqual('Helvetica');
    expect(parser.getValue('fontFamily.secondary')).toEqual('Helvetica');
    expect(parser.getValue('fontWeight.primary')).toEqual('bold');
    expect(parser.getValue('fontWeight.secondary')).toEqual('bold');

    const previous = {
      raw: parser.getRawValueCopy(),
      parsed: parser.getValuesMap(),
    };

    // test renaming tokens and groups
    expect(() => {
      parser.setToken({
        allowOverwrite: true,
        tokenPath: 'color.primary.test',
        tokenData: {
          $type: 'color',
          $value: 'lightsalmon',
        },
      });
      parser.setGroup({
        groupPath: 'color',
        groupName: 'defaults',
        oldName: 'primary',
      });
      parser.setGroup({
        groupPath: 'typography',
        groupName: 'defaults',
        oldName: 'body',
      });
      parser.setGroup({
        groupPath: 'typography',
        groupName: 'headings',
        oldName: 'heading',
      });
      parser.setGroup({
        groupName: 'fontFamilies',
        oldName: 'fontFamily',
      });
      parser.renameToken({
        oldPath: 'fontFamilies.primary',
        newPath: 'fontFamilies.default',
      });
    }).not.toThrowError();

    expect(parser.getRawValueCopy()).not.toEqual(previous.raw);
    expect(parser.getValuesMap()).not.toEqual(previous.parsed);
    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValuesMap()).toMatchSnapshot();

    // reverting changes should result in the same values as before
    expect(() => {
      parser.renameToken({
        oldPath: 'fontFamilies.default',
        newPath: 'fontFamilies.primary',
      });
      parser.setGroup({
        groupName: 'fontFamily',
        oldName: 'fontFamilies',
      });
      parser.setGroup({
        groupPath: 'typography',
        groupName: 'heading',
        oldName: 'headings',
      });
      parser.setGroup({
        groupPath: 'typography',
        groupName: 'body',
        oldName: 'defaults',
      });
      parser.setGroup({
        groupPath: 'color',
        groupName: 'primary',
        oldName: 'defaults',
      });
      parser.setToken({
        allowOverwrite: true,
        tokenPath: 'color.primary.test',
        tokenData: {
          $type: 'color',
          $value: primaryColor,
        },
      });
    }).not.toThrowError();

    const copy = parser.getRawValueCopy();
    expect(copy).toEqual(previous.raw);
    expect(parser.getValuesMap()).toEqual(previous.parsed);
    expect(parser.getRawValueCopy()).toMatchSnapshot();
    expect(parser.getValuesMap()).toMatchSnapshot();
  });
});
