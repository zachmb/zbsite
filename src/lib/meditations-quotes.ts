// A small curated set of concise lines from the Meditations (George Long
// translation), shown at the top of the home page. Each links back to its
// book in the /meditations viewer. Text is verbatim from src/lib/meditations.json.
export type Quote = { text: string; book: number; section: number };

export const quotes: Quote[] = [
	{
		text: 'Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.',
		book: 5,
		section: 16
	},
	{
		text: 'No longer talk at all about the kind of man that a good man ought to be, but be such.',
		book: 10,
		section: 18
	},
	{
		text: 'Be like the promontory against which the waves continually break, but it stands firm and tames the fury of the water around it.',
		book: 4,
		section: 51
	},
	{
		text: 'Confine thyself to the present.',
		book: 7,
		section: 29
	},
	{
		text: 'Observe constantly that all things take place by change, and accustom thyself to consider that the nature of the Universe loves nothing so much as to change the things which are and to make new things like them.',
		book: 4,
		section: 38
	},
	{
		text: 'Think not so much of what thou hast not as of what thou hast: but of the things which thou hast select the best, and then reflect how eagerly they would have been sought, if thou hadst them not.',
		book: 7,
		section: 27
	},
	{
		text: 'Everything which is in any way beautiful is beautiful in itself, and terminates in itself, not having praise as part of itself.',
		book: 4,
		section: 21
	},
	{
		text: 'Loss is nothing else than change.',
		book: 9,
		section: 36
	},
	{
		text: 'Hasten then to the end which thou hast before thee, and throwing away idle hopes, come to thy own aid, if thou carest at all for thyself, while it is in thy power.',
		book: 3,
		section: 14
	},
	{
		text: 'Remember to retire into this little territory of thy own, and above all do not distract or strain thyself, but be free, and look at things as a man, as a human being, as a citizen, as a mortal.',
		book: 4,
		section: 4
	}
];
