// Here is the complete guide to ECDSA:
// https://medium.com/@exemak/elliptic-curves-and-ecdsa-from-understanding-the-concept-to-signing-a-transaction-in-bitcoin-dd07851fe0a8
const BN = require("bignumber.js");

export const curveConfig = {
  a: new BN(0),
  b: new BN(7),
  p: new BN(
    "115792089237316195423570985008687907853269984665640564039457584007908834671663"
  )
};

export const generatorPoint = {
  x: new BN(
    "55066263022277343669578718895168534326250603453777594175500187360389116729240"
  ),
  y: new BN(
    "32670510020758816978083085130507043184471273380659243275938904335757337482424"
  ),
  orderN: new BN(
    "115792089237316195423570985008687907852837564279074904382605163141518161494337"
  )
};
