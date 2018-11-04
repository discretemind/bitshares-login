import {Apis} from "bitsharesjs-ws";
import {Settings} from "../settings";


const conn = {
  connection: null,
  chain: null,
};

const dbApi = {
  AccountByName: async (name) => {
    return await Apis.instance().db_api().exec("get_account_by_name", [name]);
  },
};

const bitsharesApi = {
  DB: dbApi,
};

export const BitShares = {
  connect: async (url) => {
    url = url ? url : Settings.DefaultNode;
    conn.connection = await Apis.instance(url, true).init_promise;
    conn.chain = conn.connection[0].network;
  },
  api: () => {
    if (conn.chain == null) {
      throw "BitShares API not connected. Please use BitShares.connect()"
    }
    return bitsharesApi
  },

  close: () => {
    Apis.instance().close()
    conn.chain = null;
    conn.connection = null
  },
};


