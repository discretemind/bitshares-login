import {PrivateKey} from "bitsharesjs"
import {BitShares} from "../api/bitshares";
import {Crypto} from "../utils/crypto";
import {Settings} from "../settings";

require('isomorphic-fetch');

export const Account = {
  getAccount: async (name) => {

    console.log("Get by name Name", name)
    let acc = await BitShares.api().DB.AccountByName(name).catch(err => console.log(err));
    if (!acc || acc.name !== name) {
      throw new Error(`Not found account ${name}! Blockchain return ${acc ? acc.name : acc}`);
    }
    return acc;
  },

  login: async (name, password) => {
    let acc = await BitShares.api().DB.AccountByName(name).catch(err => console.log(err));
    let {privKey: activePrivate, pubKey: activePub} = Crypto.KeyFromPassword(name, "active", password);

    if (activePub !== acc.active.key_auths[0][0]) {
      throw new Error("The pair of login and password do not match!")
    }

    let memoKey = PrivateKey.fromWif((acc.options.memo_key === activePub ? activePrivate : PrivateKey.fromSeed(`${name}memo${password}`)).toWif());
    return {memoKey: memoKey}
  },

  create: async (name, password) => {
    console.log("create account", name, password);
    let {pubKey: ownerPub} = Crypto.KeyFromPassword(name, "owner", password);
    let {pubKey: activePub} = Crypto.KeyFromPassword(name, "active", password);
    let {pubKey: memoPub} = Crypto.KeyFromPassword(name, "memo", password);
    console.log("owner", ownerPub);
    console.log("active", activePub);
    console.log("memo", memoPub);

    let faucetAddress = Settings.DefaultFaucet;
    return await fetch(
      faucetAddress + "/api/v1/accounts",
      {
        method: "post",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          account: {
            name: name,
            owner_key: ownerPub,
            active_key: activePub,
            memo_key: memoPub,
            refcode: null,
            referrer: null,
          },
        }),
      },
    ).then(r => r.json());
  },
};

/*
curl 'https://faucet.bitshares.eu/onboarding/api/v1/accounts'
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:63.0) Gecko/20100101 Firefox/63.0'
-H 'Accept: application/json'
-H 'Accept-Language: en-US,en;q=0.5' --compressed
-H 'Referer: https://wallet.bitshares.org/'
-H 'content-type: application/json'
-H 'origin: https://wallet.bitshares.org'
-H 'Connection: keep-alive'
--data '{"account":{"name":"dmtst11","owner_key":"BTS7Xyo7pJ6Bs9Ja5qPqeUwenzSSAr98hNcUmAsXJd8Umoug3aJMs","active_key":"BTS6f1LrXFZTzVP2Panv1dmji34C3bHHx2fXnw4ZVeZUGLGdPEC9Y","memo_key":"BTS5kCUqJ1v5xwTRXMwRhBDB4ewcPQRZZB3kMJecYtNgzH5gSznZ3","refcode":null,"referrer":null}}'


 */
