const { throws, deepEqual } = require('assert');

const main = require('./main.js');

describe('OLSKChainGather', function test_OLSKChainGather() {

	it('throws if not object', function () {
		throws(function () {
			main.OLSKChainGather(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		deepEqual(typeof main.OLSKChainGather({}), 'object');
	});

	context('OLSKChainExecute', function () {
		
		it('returns function', function () {
			deepEqual(typeof main.OLSKChainGather({}).OLSKChainExecute, 'function');
		});

		it('executes sequentially', async function () {
			const alfa = Math.random().toString();
			const bravo = Math.random().toString();

			const item = [];

			await main.OLSKChainGather({
				alfa: (function () {
					return new Promise(function (res) {
						return setTimeout(function () {
							res(item.push(alfa));
						})
					})
				}),
				bravo: (function () {
					item.push(bravo);
				}),
			}).alfa().bravo().bravo().alfa().bravo().OLSKChainExecute();

			deepEqual(item, [alfa, bravo, bravo, alfa, bravo]);
		});

		it('returns results array', async function () {
			const alfa = Math.random().toString();
			const bravo = Math.random().toString();

			deepEqual(await main.OLSKChainGather({
				alfa: (function () {
					return new Promise(function (res) {
						return setTimeout(function () {
							res(alfa);
						})
					})
				}),
				bravo: (function () {
					return bravo;
				}),
			}).alfa().bravo().OLSKChainExecute(), [alfa, bravo]);
		});
	
	});

	context('param', function () {
		
		it('includes if function', function () {
			deepEqual(Object.keys(main.OLSKChainGather({
				alfa: (function () {}),
			})), ['_OLSKChainQueue', 'OLSKChainExecute', 'alfa']);
		});

		it('excludes', function () {
			deepEqual(Object.keys(main.OLSKChainGather({
				alfa: Math.random().toString(),
			})), ['_OLSKChainQueue', 'OLSKChainExecute']);
		});
	
	});

	context('call param', function () {

		it('returns chain if single', function () {
			deepEqual(Object.keys(main.OLSKChainGather({
				alfa: (function () {}),
			}).alfa()), ['_OLSKChainQueue', 'OLSKChainExecute', 'alfa']);
		});

		it('returns chain if multiple', function () {
			deepEqual(Object.keys(main.OLSKChainGather({
				alfa: (function () {}),
				bravo: (function () {}),
			}).alfa().bravo()), ['_OLSKChainQueue', 'OLSKChainExecute', 'alfa', 'bravo']);
		});
		
		it('adds item to _OLSKChainQueue', function () {
			deepEqual(main.OLSKChainGather({
				alfa: (function () {}),
			}).alfa()._OLSKChainQueue.length, 1);
		});

		it('passes params', async function () {
			const alfa = Math.random().toString();
			const bravo = Math.random().toString();

			deepEqual(await main.OLSKChainGather({
				alfa: (function (inputData) {
					return new Promise(function (res) {
						return setTimeout(function () {
							res(inputData);
						})
					})
				}),
				bravo: (function (inputData) {
					return inputData;
				}),
			}).alfa(alfa).bravo(bravo).OLSKChainExecute(), [alfa, bravo]);
		});

	});

});
