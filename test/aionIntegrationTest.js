const assert = require('chai').assert;
const RLP = require('../index.js');
const BN = require('bn.js');
const AionLong = RLP.AionLong;

describe("Aion flavoured RLP integration", () => {

	it("should properly encode from AionLong", () => {
		const al = new AionLong(new BN(1));
		console.log(al.getEncoded().toString('hex'));
	});

	/**
	    public static final int RLP_TX_NONCE = 0,
	    RLP_TX_TO = 1,
	    RLP_TX_VALUE = 2,
	    RLP_TX_DATA = 3,
	    RLP_TX_TIMESTAMP = 4,
      RLP_TX_NRG = 5,
      RLP_TX_NRGPRICE = 6,
      RLP_TX_TYPE = 7,
      RLP_TX_SIG = 8;
  */

	it("should properly encode long elements", () => {
		const expectedOutput = "f85301a09aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c01a0a035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e80830f42408800000002540be40001";
		const txArray = new Array();

		txArray.push(new BN(1));
		txArray.push("0x9aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c");
		txArray.push(new BN(1));
		txArray.push("0xa035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e");
		txArray.push(new BN(0));
		txArray.push(new BN(21000));
		txArray.push(new BN(10000000000));
		txArray.push(new BN(1));
		const output = RLP.encode(txArray);
		console.log(output.toString('hex'));
		assert.equal(output.toString('hex'), expectedOutput);
	});
});