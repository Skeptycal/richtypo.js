export const defs = {
  space: '[ \t]',
  nbsp: '\xA0',
  hairspace: '\xAF',
  tag: '</?\\w+>',
  quotes: '["“”«»‘’]',
  letters: '[a-zà-ž0-9-]',
  upperletters: '[A-ZÀ-Ž0-9-]',
  nonletters: '[^a-zà-ž0-9-]',
  letterswithquotes: '[a-zà-ž0-9-“”‘’«»]',
  semicolon: '(?<!&\\S*);',
  punctuation: ({ semicolon, quotes }) =>
    `(?:${semicolon}|${quotes}|[\\.,!?:])`,
  dash: '[-—]',
  thousandsSeparator: ',',
  decimalsSeparator: '[.]',
  ordinals: '(?:st|nd|rd|th)',
  openingQuote: '“',
  closingQuote: '”',
  shortWord: ({ letters, tag }) => `\\b${letters}{1,2}\\b(${tag})?`
};

// Non-breaking space after short words
const shortWordsBreak = ({ shortWord, space, nbsp }) => ({
  regex: `(${shortWord})${space}`,
  result: `$1${nbsp}`
});

// Orphans (non-breaking space before the last word)
export const orphans = ({ space, nbsp }) => ({
  regex: `${space}([\\S<]{1,10}(?:\n\n|$))`,
  result: `${nbsp}$1`
});

export const spaces = [shortWordsBreak, orphans];

export const emdash = [
  ({ space, nbsp }) => ({
    regex: `(\\S)${space}?—`,
    result: `$1${nbsp}—`
  }),
  {
    regex: `—(\\S)`,
    result: `— $1`
  },
  ({ space, nbsp, letterswithquotes, tag, dash }) => ({
    regex: `(${letterswithquotes}(${tag})?)${space}${dash}`,
    result: `$1${nbsp}—`
  }),
  ({ space, nbsp, punctuation, dash }) => ({
    regex: `(^|(?:${punctuation}${space}?))${dash}${space}`,
    result: `$1—${nbsp}`
  })
];

export const ellipsis = {
  regex: `\\.{2,}`,
  result: `…`
};

export const amp = ({ space, nbsp }) => ({
  regex: `${space}(&(?!\\S*;))${space}`,
  result: `${nbsp}<span class="amp">&</span>${nbsp}`
});

export const abbr = ({ upperletters }) => ({
  regex: `(${upperletters}{3,})`,
  flags: `gm`,
  result: `<abbr>$1</abbr>`
});

export const numbers = [
  ({ ordinals }) => ({
    regex: `(\\d+)(${ordinals})`,
    result: `$1<sup>$2</sup>`
  }),
  ({ decimalsSeparator, thousandsSeparator }) => ({
    regex: `(?<!${decimalsSeparator}\\d*)\\d{1,3}(?=(\\d{3})+(?!\\d))`,
    result: `$&${thousandsSeparator}`
  })
];

export const quotes = [
  ({ tag, letters, openingQuote }) => ({
    regex: `(?:")((${tag})?${letters})`,
    result: `${openingQuote}$1`
  }),
  ({ closingQuote }) => ({
    regex: `(?:")`,
    result: `${closingQuote}`
  })
];