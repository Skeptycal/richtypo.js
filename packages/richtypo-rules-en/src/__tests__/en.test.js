import rt from 'richtypo';

import recommended, {
	shortWords,
	orphans,
	quotes,
	abbrs,
	amps,
	dashes,
	ellipses,
	degreeSigns,
	numberUnits,
	numberOrdinals,
	numberSeparators,
} from '../en';

function compare(actual, expected) {
	expect(
		actual
			.replace(/\xA0/g, '__')
			.replace(/&#x202f;/g, '_')
			.replace(/—/g, '=')
	).toEqual(expected);
}

describe('non-breaking space', () => {
	it('should add non-breaking space before orphans', () => {
		compare(rt(orphans, `Still don't you think?`), `Still don't you__think?`);
	});
	it('should add non-breaking space after short words', () => {
		compare(
			rt(shortWords, `This is <b>of</b> the hook`),
			`This is__<b>of</b>__the hook`
		);
	});
	it('should add non-breaking space between a number and a degree sign', () => {
		compare(
			rt(degreeSigns, `Must be <b>-30</b> °C? Or -25°C maybe`),
			`Must be <b>-30</b>_°C? Or -25_°C maybe`
		);
	});
});

describe('abbr', () => {
	it('should wrap abbreviations in <abbr>', () => {
		compare(
			rt(abbrs, `DOXIE and ONU and DaN`),
			`<abbr>DOXIE</abbr> and <abbr>ONU</abbr> and DaN`
		);
	});
});

describe('amp', () => {
	it('should wrap & in a span', () => {
		compare(
			rt(amps, `Dessi & Tsiri`),
			`Dessi__<span class="amp">&</span>__Tsiri`
		);
	});
});

describe('em-dash', () => {
	it(`should add non-breaking spaces before em-dash`, () => {
		compare(
			rt(dashes, `<i>Dachshund</i> - <b>beast</b>.`),
			`<i>Dachshund</i>__= <b>beast</b>.`
		);
		compare(rt(dashes, `Naïve — word.`), `Naïve__= word.`);
		compare(rt(dashes, `“Richtypo” — awesome!`), `“Richtypo”__= awesome!`);
		compare(rt(dashes, `Dachshund—beast.`), `Dachshund__= beast.`);
	});

	it(`should add non-breaking spaces after em-dash when the em-dash is starting a line or sentence.`, () => {
		compare(rt(dashes, `- Beast!. - Zombie!`), `=__Beast!. =__Zombie!`);
		compare(
			rt(
				dashes,
				`- Beast!
- Zombie!`
			),
			`=__Beast!
=__Zombie!`
		);
	});
});

describe('ellipsis', () => {
	it(`should replace '...' with ellipsis …`, () => {
		compare(rt(ellipses, `Yes... Hello.`), `Yes… Hello.`);
	});
});

describe('numbers', () => {
	it(`should add a non-breaking space between a number and its unit`, () => {
		compare(rt(numberUnits, `1 kg, 2 m`), `1__kg, 2__m`);
	});
	it(`should put 1st 2nd 3rd etc in subscript`, () => {
		compare(
			rt(numberOrdinals, `1st 2nd 3rd 4th 100th`),
			`1<sup>st</sup> 2<sup>nd</sup> 3<sup>rd</sup> 4<sup>th</sup> 100<sup>th</sup>`
		);
	});
	it(`should add space as number separators`, () => {
		compare(
			rt(
				numberSeparators,
				`There are <b>6234689821</b> people, revenue is 1432.331123 yens`
			),
			`There are <b>6,234,689,821</b> people, revenue is 1,432.331123 yens`
		);
	});
});

describe('quotes', () => {
	it(`should change quotes "..." into typo quotes “...”`, () => {
		compare(
			rt([quotes], `This is a "text in quotes"`),
			`This is a “text in quotes”`
		);
		compare(
			rt(quotes, `This is a "texte "with inner text" in quotes"`),
			`This is a “texte “with inner text” in quotes”`
		);
		compare(
			rt(quotes, `This is a "<b>text in quotes with an HTML tag</b>"`),
			`This is a “<b>text in quotes with an HTML tag</b>”`
		);
		compare(
			rt(
				quotes,
				`Presently she began again. "I wonder if I shall fall right through the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think -" (she was rather glad there was no one listening, this time, as it didn’t sound at all the right word) "- but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?" (and she tried to curtsey as she spoke - fancy curtseying as you’re falling through the air! Do you think you could manage it?) "And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere."`
			),
			`Presently she began again. “I wonder if I shall fall right through the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think -” (she was rather glad there was no one listening, this time, as it didn’t sound at all the right word) “- but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?” (and she tried to curtsey as she spoke - fancy curtseying as you’re falling through the air! Do you think you could manage it?) “And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere.”`
		);
	});
});

describe('recommended rules', () => {
	const allRules = rt(recommended);
	it(`should run recommended rules`, () => {
		compare(
			allRules(
				`<p>Down, down, down. There was nothing else to do, so Alice soon began talking again. "Dinah’ll miss me very much to-night, I should think!" (Dinah was the cat.) "I hope they’ll remember her saucer of milk at tea-time. Dinah my dear! I wish you were down here with me! There are no mice in the air, I’m afraid, but you might catch a bat, and that’s very like a mouse, you know. But do cats eat bats, I wonder?" And here Alice began to get rather sleepy, and went on saying to herself, in a dreamy sort of way, "Do cats eat bats? Do cats eat bats?" and sometimes, "Do bats eat cats?’ for, you see, as she couldn’t answer either question, it didn’t much matter which way she put it. She felt that she was dozing off, and had just begun to dream that she was walking hand in hand with Dinah, and saying to her very earnestly, "Now, Dinah, tell me the truth: did you ever eat a bat?" when suddenly, thump! thump! down she came upon a heap of sticks and dry leaves, and the fall was over.</p>`
			),
			`<p>Down, down, down. There was nothing else to__do, so__Alice soon began talking again. “Dinah’ll__miss me__very much to-night, I__should think!” (Dinah was the cat.) “I__hope they’ll__remember her saucer of__milk at__tea-time. Dinah my__dear! I__wish you were down here with me! There are no__mice in__the air, I’m__afraid, but you might catch a__bat, and that’s__very like a__mouse, you know. But do__cats eat bats, I__wonder?” And here Alice began to__get rather sleepy, and went on__saying to__herself, in__a__dreamy sort of__way, “Do__cats eat bats? Do__cats eat bats?” and sometimes, “Do__bats eat cats?’ for, you see, as__she couldn’t__answer either question, it__didn’t__much matter which way she put it. She felt that she was dozing off, and had just begun to__dream that she was walking hand in__hand with Dinah, and saying to__her very earnestly, “Now, Dinah, tell me__the truth: did you ever eat a__bat?” when suddenly, thump! thump! down she came upon a__heap of__sticks and dry leaves, and the fall was__over.</p>`
		);
		compare(
			allRules(
				`Presently she began again. "I wonder if I shall fall right through the earth! How funny it’ll seem to come out among the people that walk with their heads downward! The Antipathies, I think -" (she was rather glad there was no one listening, this time, as it didn’t sound at all the right word) "- but I shall have to ask them what the name of the country is, you know. Please, Ma’am, is this New Zealand or Australia?" (and she tried to curtsey as she spoke - fancy curtseying as you’re falling through the air! Do you think you could manage it?) "And what an ignorant little girl she’ll think me for asking! No, it’ll never do to ask: perhaps I shall see it written up somewhere."`
			),
			`Presently she began again. “I__wonder if__I__shall fall right through the earth! How funny it’ll__seem to__come out among the people that walk with their heads downward! The Antipathies, I__think__=” (she was rather glad there was no__one listening, this time, as__it__didn’t__sound at__all the right word) “=__but I__shall have to__ask them what the name of__the country is, you know. Please, Ma’am, is__this New Zealand or__Australia?” (and she tried to__curtsey as__she spoke__= fancy curtseying as__you’re__falling through the air! Do__you think you could manage it?) “And what an__ignorant little girl she’ll__think me__for asking! No, it’ll__never do__to__ask: perhaps I__shall see it__written up__somewhere.”`
		);
		compare(
			allRules(`There are 1000 "rules" to enrich your text with RichTypo.`),
			`There are 1000 “rules” to__enrich your text with__RichTypo.`
		);
	});
});