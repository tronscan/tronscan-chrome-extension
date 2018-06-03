import '../img/icon-128.png';
import '../img/icon-34.png';
import {wrapStore} from 'react-chrome-redux';
import configureStore from "./redux/store";
import {byteArray2hexStr} from "@tronscan/client/src/utils/bytes";
import {hexStr2byteArray} from "@tronscan/client/src/lib/code";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import {signTransaction} from "@tronscan/client/src/utils/crypto";
import SignService from "./services/signService";

const { store } = configureStore();

wrapStore(store, {portName: 'TRONSCAN_EXT'});
let signService = new SignService();

chrome.notifications.onButtonClicked.addListener((callback, buttonIndex) => {
  if (buttonIndex === 0) {
    signService.requests[callback].resolve(true);
  } else {
    signService.requests[callback].reject();
  }
});

chrome.extension.onMessage.addListener(async (request, sender) => {

  console.log("BACKGROUND REQUEST", request);

  function sendResponse(responseData) {
    responseData = Object.assign({
      callbackId: request.callbackId,
      _source: "bg",
    }, responseData);

    // TODO querying tabs using this method isn't reliable
    chrome.tabs.query({ currentWindow: true, active: true, }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, responseData);
    });
  }

  switch (request.type) {
    case "TRONSCAN_TRANSACTION":

      let bytesDecode = hexStr2byteArray(request.transaction.hex);
      let transaction = Transaction.deserializeBinary(bytesDecode);

      try {

      await signService.requestSign(transaction);
        let privateKey = store.getState().privateKey;

        let { transaction: signedTransaction } = signTransaction(privateKey, transaction);

        sendResponse({
          type: "TRONSCAN_TRANSACTION_RESPONSE",
          transaction: {
            hex: byteArray2hexStr(signedTransaction.serializeBinary()),
          }
        });
      } catch(e) {
        sendResponse({
          type: "TRONSCAN_TRANSACTION_RESPONSE",
          rejected: true,
        });
      }

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


function navigateTo(url) {
  chrome.tabs.update({ url });
}


// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener((text) => {

  let [category, value] = text.split(":");

  switch (category) {
    case "trx":
      navigateTo('https://tronscan.org/#/transaction/' + value);
      break;
    case "block":
      navigateTo('https://tronscan.org/#/block/' + value);
      break;
    case "token":
      navigateTo('https://tronscan.org/#/token/' + value);
      break;
    case "address":
      navigateTo('https://tronscan.org/#/address/' + value);
      break;
  }
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  suggest([
    {content: "address:" + text, description: "Address: " + text},
    {content: "trx:" + text, description: "Transaction" + text},
    {content: "block:" + text, description: "Block" + text},
    {content: "token:" + text, description: "Token" + text},
  ]);
});

