import {PrivateKey} from "bitsharesjs";

const generateKeyFromPassword = (accountName, role, password) => {
  let seed = accountName + role + password;
  let privKey = PrivateKey.fromSeed(seed);
  let pubKey = privKey.toPublicKey().toPublicKeyString("BTS");

  return {privKey, pubKey};
};

export const Crypto = {
  KeyFromPassword: generateKeyFromPassword,
};
