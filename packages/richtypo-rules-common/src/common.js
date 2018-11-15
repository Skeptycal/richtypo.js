const nbsp = '\xA0';
const hairspace = '\xAF';
const space = `[ \t${nbsp}${hairspace}]`;
const tag = '(?:<[^<>]*>)';
const quotes = '["“”«»‘’]';
const letters = '[a-zà-ž0-9а-яё]';
const upperLetters = '[A-ZÀ-ŽdА-ЯЁ]';
const lettersWithQuotes = `(?:${letters}|[-“”‘’«»])`;
const semicolon = '(?<!&\\S*);';
const punctuation = `(?:${semicolon}|[\\.,!?:])`;
const dash = '[-—]';
const openingQuotes = `[“«]`; // TODO: Shouldn't be here
const shortWord = `${letters}{1,2}`;
const notInTag = `(?<!<[^>]*)`;

export const definitions = {
	nbsp,
	hairspace,
	space,
	tag,
	quotes,
	letters,
	upperLetters,
	lettersWithQuotes,
	semicolon,
	punctuation,
	dash,
	openingQuotes,
	shortWord,
	notInTag,
};

// Non-breaking space after short words
export const shortWordBreak = text =>
	text.replace(
		new RegExp(
			`${notInTag}(?<=^|${space}|${quotes}|>)(${shortWord}(${tag})?)${space}`,
			'gmi'
		),
		`$1${nbsp}`
	);

// Orphans (non-breaking space before the last word)
export const orphans = text =>
	text.replace(
		new RegExp(`${notInTag}${space}([\\S<]{1,10}(?:\n\n|$))`, 'gmi'),
		`${nbsp}$1`
	);

export const numberUnits = text =>
	text.replace(
		new RegExp(`${notInTag}(\\d+${tag}?)${space}(\\w)`, 'gmi'),
		`$1${nbsp}$2`
	);

// TODO: Use hair space
// TODO: Rename to degreeSigns
export const temperature = text =>
	text.replace(
		new RegExp(`${notInTag}(\\d${tag}?)${space}?°`, 'gmi'),
		`$1${nbsp}°`
	);

export const spaces = [numberUnits, temperature, shortWordBreak, orphans];

// TODO: Hair space in English?
export const emdash = text =>
	text
		.replace(new RegExp(`${notInTag}(\\S)${space}?—`, 'gmi'), `$1${nbsp}—`)
		.replace(new RegExp(`${notInTag}—(\\S)`, 'gmi'), `— $1`)
		.replace(
			new RegExp(
				`${notInTag}(${lettersWithQuotes}(${tag})?)${space}${dash}`,
				'gmi'
			),
			`$1${nbsp}—`
		)
		.replace(
			new RegExp(
				`(${notInTag}^|(?:(${punctuation}|${openingQuotes}|")${space}?))${dash}${space}`,
				'gmi'
			),
			`$1—${nbsp}`
		);

export const ellipsis = text =>
	text.replace(new RegExp(`${notInTag}\\.{2,}`, 'gmi'), `…`);

export const amp = text =>
	text.replace(
		new RegExp(`${notInTag}${space}(&(?!\\S*;))${space}`, 'gmi'),
		`${nbsp}<span class="amp">&</span>${nbsp}`
	);

export const abbr = text =>
	text.replace(
		new RegExp(`${notInTag}(${upperLetters}{3,})`, 'gm'),
		`<abbr>$1</abbr>`
	);

export const numberOrdinalsFactory = ({ ordinals }) => text =>
	text.replace(
		new RegExp(`${notInTag}(\\d+)(${ordinals})`, 'gmi'),
		`$1<sup>$2</sup>`
	);

export const numberSeparatorsFactory = ({
	decimalsSeparator,
	thousandsSeparator,
}) => text =>
	text.replace(
		new RegExp(
			`(?<!${decimalsSeparator}\\d*)\\d{1,3}(?=(\\d{3})+(?!\\d))`,
			'gmi'
		),
		`$&${thousandsSeparator}`
	);

export const quotesFactory = ({ openingQuote, closingQuote }) => text =>
	text
		.replace(
			new RegExp(`${notInTag}"((${tag})?(${dash}${space})?${letters})`, 'gmi'),
			`${openingQuote}$1`
		)
		.replace(new RegExp(`${notInTag}"`, 'gmi'), `${closingQuote}`);
