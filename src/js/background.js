import '../img/icon-128.png';
import '../img/icon-34.png';
import {wrapStore} from 'react-chrome-redux';
import configureStore from "./redux/store";
import {byteArray2hexStr} from "@tronscan/client/src/utils/bytes";
import {hexStr2byteArray} from "@tronscan/client/src/lib/code";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import {signTransaction} from "@tronscan/client/src/utils/crypto";

const { store } = configureStore();

wrapStore(store, {portName: 'TRONSCAN_EXT'});

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {

  switch (request.type) {
    case "TRONSCAN_TRANSACTION":
      let bytesDecode = hexStr2byteArray(request.transaction.hex);
      let transaction = Transaction.deserializeBinary(bytesDecode);
      let privateKey = store.getState().privateKey;

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

    case "TRONSCAN_REQUEST_ACCOUNT":
      sendResponse({
        type: "TRONSCAN_ACCOUNT_RESPONSE",
        account: store.getState().account,
      });
      break;
  }


});
