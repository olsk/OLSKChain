const mod = {

	OLSKChainGather (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('OLSKErrorInputNotValid');
		}

		const _OLSKChainQueue = [];

		const _OLSKChainGatherObject = function () {
			return Object.keys(inputData).reduce(function (coll, item) {
				return Object.assign(coll, typeof inputData[item] === 'function' ? {
					[item]: function () {
						const _arguments = arguments;

						_OLSKChainQueue.push(function () {
							return inputData[item](..._arguments);
						});

						return _OLSKChainGatherObject();
					},
				} : {});
			}, {
				_OLSKChainQueue,
				OLSKChainExecute () {
					return _OLSKChainQueue.reduce(async function (coll, e) {
						return (await coll).concat(await e());
					}, Promise.resolve([]));
				},
			});
		};

		return _OLSKChainGatherObject();
	},

};

Object.assign(exports, mod);
