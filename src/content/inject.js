window.addEventListener("message", function(event) {

  if (event.source !== window)
    return;

  if (event.data.type && (event.data.type === "TRONSCAN_TRANSACTION")) {

    chrome.runtime.sendMessage(event.data, function(response) {

      let messageToPage = {
        type: "TRONSCAN_TRANSACTION_RESPONSE",
        transaction: response.transaction,
        callbackId: event.data.callbackId,
      };

      window.postMessage(messageToPage, "*");
    });
  }
});
