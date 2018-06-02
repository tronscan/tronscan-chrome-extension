import '../img/icon-128.png'
import '../img/icon-34.png'

const {byteArray2hexStr} = require("@tronscan/client/src/utils/bytes");
const hexStr2byteArray = require("@tronscan/client/src/lib/code").hexStr2byteArray;
const {Transaction} = require("@tronscan/client/src/protocol/core/Tron_pb");
const {signTransaction} = require("@tronscan/client/src/utils/crypto");

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {

  let bytesDecode = hexStr2byteArray(request.transaction.hex);
  let transaction = Transaction.deserializeBinary(bytesDecode);

  let { transaction: signedTransaction } = signTransaction(privateKey, transaction);

  sendResponse({
    callbackId: request.callbackId,
    transaction: {
      hex: byteArray2hexStr(signedTransaction.serializeBinary()),
    }
  });
});
