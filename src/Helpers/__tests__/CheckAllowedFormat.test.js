import CheckAllowedFormat from '../CheckAllowedFormat';

test('Check positive', () => {
	expect(CheckAllowedFormat('/data/test/123.pdf')).toBe(true);
	expect(CheckAllowedFormat('/data/test/123.Pdf')).toBe(true);
	expect(CheckAllowedFormat('/data/test/123.PDF')).toBe(true);
});

test('Check negative', () => {
	expect(CheckAllowedFormat('/data/test/123.pAdf')).toBe(false);
	expect(CheckAllowedFormat('/data/test/123.JS')).toBe(false);
});
