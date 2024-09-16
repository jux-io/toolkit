import * as CSS from 'csstype';

export function generateResetStyles(): Record<string, CSS.Properties> {
  return {
    '*, ::before, ::after, ::backdrop, ::file-selector-button': {
      boxSizing: 'border-box',
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: 'currentcolor',
    },
    'html, :host': {
      lineHeight: 1.5,
      WebkitTextSizeAdjust: '100%',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      MozTabSize: 4,
      tabSize: 4,
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      fontFeatureSettings: 'normal',
      fontVariationSettings: 'normal',
      WebkitTapHighlightColor: 'transparent',
    },
    body: {
      margin: 0,
      lineHeight: 'inherit',
    },
    hr: {
      height: 0,
      color: 'inherit',
      borderTopWidth: '1px',
    },
    'abbr:where([title])': {
      textDecoration: 'underline dotted',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontSize: 'inherit',
      fontWeight: 'inherit',
    },
    a: {
      color: 'inherit',
      textDecoration: 'inherit',
    },
    'b, strong': {
      fontWeight: 'bolder',
    },
    'code, kbd, samp, pre': {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New'",
      fontFeatureSettings: 'normal',
      fontVariationSettings: 'normal',
      fontSize: '1em',
    },
    small: {
      fontSize: '80%',
    },
    'sub, sup': {
      fontSize: '75%',
      lineHeight: 0,
      position: 'relative',
      verticalAlign: 'baseline',
    },
    sub: {
      bottom: '-0.25em',
    },
    sup: {
      top: '-0.5em',
    },
    table: {
      textIndent: '0',
      borderColor: 'inherit',
      borderCollapse: 'collapse',
    },
    'button, input, optgroup, select, textarea, ::file-selector-button': {
      font: 'inherit',
      fontFeatureSettings: 'inherit',
      fontVariationSettings: 'inherit',
      letterSpacing: 'inherit',
      color: 'inherit',
      background: 'transparent',
    },
    'button, select': {
      textTransform: 'none',
    },
    'button, input:where([type="button"]), input:where([type="reset"]), input:where([type="submit"]), ::file-selector-button':
      {
        WebkitAppearance: 'button',
        backgroundColor: 'transparent',
        backgroundImage: 'none',
      },
    ':-moz-focusring': {
      outline: 'auto',
    },
    ':-moz-ui-invalid': {
      boxShadow: 'none',
    },
    progress: {
      verticalAlign: 'baseline',
    },
    '::-webkit-inner-spin-button, ::-webkit-outer-spin-button': {
      height: 'auto',
    },
    '[type="search"]': {
      WebkitAppearance: 'textfield',
      outlineOffset: '-2px',
    },
    '::-webkit-search-decoration, ::-webkit-search-cancel-button': {
      WebkitAppearance: 'none',
    },
    '::-webkit-file-upload-button': {
      WebkitAppearance: 'button',
      font: 'inherit',
    },
    summary: {
      display: 'list-item',
    },
    'blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre': {
      margin: 0,
    },
    fieldset: {
      margin: 0,
      padding: 0,
    },
    legend: {
      padding: 0,
    },
    'ol, ul, menu': {
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    dialog: {
      padding: 0,
    },
    textarea: {
      resize: 'vertical',
    },
    'input::placeholder, textarea::placeholder': {
      color: 'color-mix(in srgb, currentColor 50%, transparent)',
      opacity: 1,
    },
    ':disabled': {
      cursor: 'default',
    },
    img: {
      borderStyle: 'none',
    },
    'img, svg, video, canvas, audio, iframe, embed, object': {
      display: 'block',
      verticalAlign: 'middle',
    },
    'img, video': {
      maxWidth: '100%',
      height: 'auto',
    },
    '[hidden]': {
      display: 'none',
    },
  };
}
