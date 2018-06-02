import '../img/icon-128.png';
import '../img/icon-34.png';
import {wrapStore} from 'react-chrome-redux';

import configureStore from "./redux/store";

const { store } = configureStore();

wrapStore(store, {portName: 'TRONSCAN_EXT'});

const {byteArray2hexStr} = require("@tronscan/client/src/utils/bytes");
const hexStr2byteArray = require("@tronscan/client/src/lib/code").hexStr2byteArray;
const {Transaction} = require("@tronscan/client/src/protocol/core/Tron_pb");
const {signTransaction} = require("@tronscan/client/src/utils/crypto");

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {

  console.log("BACKGROUND MESSAGE", request);

  switch (request.type) {
    case "TRONSCAN_TRANSACTION":
      let bytesDecode = hexStr2byteArray(request.transaction.hex);
      let transaction = Transaction.deserializeBinary(bytesDecode);
      let privateKey = store.getState().privateKey;

      console.log("USING PK", privateKey);

      let { transaction: signedTransaction } = signTransaction(privateKey, transaction);

      sendResponse({
        type: "TRONSCAN_TRANSACTION_RESPONSE",
        transaction: {
          hex: byteArray2hexStr(signedTransaction.serializeBinary()),
        }
      });
      break;
    case "TRONSCAN_PING":
      sendResponse({
        type: "TRONSCAN_PONG",
      });
      break;
  }


});
