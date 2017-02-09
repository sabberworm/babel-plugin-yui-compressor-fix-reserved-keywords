import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';
import plugin from '../src';

function trim(str) {
	return str.replace(/^\s+|\s+$/, '');
}

var info = require('../package.json');

describe(info.description, () => {
	const fixturesDir = path.join(__dirname, 'fixtures');
	fs.readdirSync(fixturesDir).map((caseName) => {
		if(caseName.indexOf('.') === 0) {
			return;
		}
		const fixtureDir = path.join(fixturesDir, caseName);
		if(!fs.statSync(fixtureDir).isDirectory()) {
			return;
		}
		it(`should fixup ${caseName.split('-').join(' ')}`, () => {
			const actualPath = path.join(fixtureDir, 'actual.js');
			const actual = transformFileSync(actualPath).code;

			const expected = fs.readFileSync(
					path.join(fixtureDir, 'expected.js')
			).toString();

			assert.equal(trim(actual), trim(expected));
		});
	});
});
