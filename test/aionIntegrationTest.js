const assert = require('chai').assert;
const RLP = require('../index.js');
const BN = require('bn.js');
const AionLong = RLP.AionLong;

const assertHex = (input, output) =>
  assert.equal(RLP.encode(input).toString('hex'), output)

describe("Aion flavoured RLP integration", () => {

  it("should properly encode from AionLong", () => {
    const al = new AionLong(new BN(1));
    console.log(al.getEncoded().toString('hex'));
  });

  it("should match an equivalent Aion encoded transaction", () => {
    const expectedOutput = "f84801a09aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c01a0a035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e80010101";
    const txArray = new Array();

    txArray.push(new BN(1));
    txArray.push("0x9aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c");
    txArray.push(new BN(1));
    txArray.push("0xa035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e");
    txArray.push(null);
    txArray.push(new AionLong(new BN(1)));
    txArray.push(new AionLong(new BN(1)));
    txArray.push(new BN(1));

    const output = RLP.encode(txArray);
    assert.equal(output.toString('hex'), expectedOutput);
  });

  it("should match an equivalent Aion encoded transaction", () => {
    const expectedOutput = "f85301a09aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c01a0a035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e80831e848088000009184e72a00001";
    const txArray = new Array();

    txArray.push(new BN(1));
    txArray.push("0x9aabf5b86690ca4cae3fada8c72b280c4b9302dd8dd5e17bd788f241d7e3045c");
    txArray.push(new BN(1));
    txArray.push("0xa035872d6af8639ede962dfe7536b0c150b590f3234a922fb7064cd11971b58e");
    txArray.push(null);
    txArray.push(new AionLong(new BN(2000000)));
    txArray.push(new AionLong(new BN("10000000000000")));
    txArray.push(new BN(1));

    const output = RLP.encode(txArray);
    assert.equal(output.toString('hex'), expectedOutput);
  });

  /*

  ported from:
  https://github.com/aionnetwork/aion/blob/master/modRlp/test/org/aion/rlp/RlpTestData.java

  */

  it("number 0", () => {
    assertHex(0, "80");
  });

  it("number 1", () => {
    assertHex(1, "01");
  });

  it("number 10", () => {
    assertHex(10, "0a");
  });

  it("letter d", () => {
    assertHex("d", "64");
  });

  it("string cat", () => {
    assertHex("cat", "83636174");
  });

  it("string dog", () => {
    assertHex("dog", "83646f67");
  });

  it("string array", () => {
    assertHex(["cat", "dog"], "c88363617483646f67");
  });

  it("string array 2", () => {
    assertHex(["dog", "god", "cat"], "cc83646f6783676f6483636174");
  });

  it("number 100", () => {
    assertHex(100, "64");
  });

  it("number 1000", () => {
    assertHex(1000, "8203e8");
  });

  it("BN 01", () => {
    assertHex(
      new BN("115792089237316195423570985008687907853269984665640564039457584007913129639935"),
      "a0ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    );
  });

  it("BN 02", () => {
    assertHex(
      new BN("115792089237316195423570985008687907853269984665640564039457584007913129639936"),
      "a1010000000000000000000000000000000000000000000000000000000000000000"
    );
  });

  it("numbers and blank array", () => {
    const input = [1, 2, []]
    const output = "c30102c0"
    assertHex(input, output);
    // console.log(RLP.decode('0x' + output))
    // assert.deepEqual(RLP.decode('0x' + output), input)
  });

  it("nested blank arrays", () => {
    assertHex([[[], []], []], "c4c2c0c0c0");
  });

  it("strings and array", () => {
    const input = ["zw", [4], "wz"]
    const output = "c8827a77c10482777a"
    assertHex(input, output);
    // assert.deepEqual(RLP.decode(output), input)
  });

  /*

  ported from:
  https://github.com/aionnetwork/aion/blob/master/modRlp/test/org/aion/rlp/RLPTest.java

  */

  const assertAionLong = val => {
    const longNum = new AionLong(new BN(val));
    const encoded = RLP.encode(longNum);
    const decoded = new BN(RLP.decode(encoded));
    assert.equal(val, decoded.toString());
  }

  it('long 01', () => {
    assertAionLong('314159');
  });

  it('long 02', () => {
    assertAionLong(new BN('0xFFFFFFFFF', 'hex').toString());
  });

  it('long 03', () => {
    assertAionLong('1');
  });

  //
  // some others not present in the other tests
  //

  it('long 04', () => {
    assertAionLong('7332199412131513');
  });

  it('long max', () => {
    assertAionLong('9223372036854775807');
  });

  it('long over max throws', () => {
    assert.throws(() => assertAionLong('9223372036854775808'));
  });
});
