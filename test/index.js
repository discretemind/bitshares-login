import {assert} from 'chai';
import {Crypto} from "../src/utils/crypto";
import {Account} from "../src/account/account";
import {BitShares} from "../src/api/bitshares";

describe('Test Crypto', () => {
  it('should test key generations from password', () => {
    let key = Crypto.KeyFromPassword("username1", "owner", "password1");
    assert(key !== undefined);
    assert(key.privKey != null);
    console.log("test res");
  });
});

describe('Test Get Account By Name', () => {
  it('should test get account by name', () => {
    BitShares.connect("wss://bitshares.openledger.info/ws").then(() => {
      return Account.getAccount("dmtestusername1").then(acc => {
        assert(acc != null);
        BitShares.close();
      }).catch(e => {
        assert(e == null);
        BitShares.close();
      })
    }).catch(e => console.log(e));
    console.log("done!");
  });
});

// describe('Test Login Account', () => {
//   it('should test login account', () => {
//     BitShares.connect("wss://bitshares.openledger.info/ws").then(() => {
//       return Account.login("dmtestusername1", "password1").then(acc => {
//         assert(acc != null);
//         BitShares.close();
//       }).catch(e => {
//         console.log(e)
//         assert(e == null);
//         // BitShares.close();
//       })
//     }).catch(e => console.log(e));
//     console.log("done!");
//   });
// });
