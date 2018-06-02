window.addEventListener("message", function(event) {

  if (event.source !== window)
    return;

  if (event.data.type && (event.data.type.substr(0, 9) === "TRONSCAN_")) {

    chrome.runtime.sendMessage(event.data, function(response) {

      let messageToPage = Object.assign({
        callbackId: event.data.callbackId,
      }, response);

      window.postMessage(messageToPage, "*");
    });
  }
});

