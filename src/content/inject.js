console.log("Tronscan Extension Active");

window.addEventListener("message", function(event) {

  if (event.source !== window)
    return;

  if (event.data.type && (event.data.type.substr(0, 9) === "TRONSCAN_")) {

    console.log("INJECT", event.data);

    chrome.runtime.sendMessage(event.data);
  }
});

chrome.extension.onMessage.addListener(async (request) => {


  console.log("INJECT RESPONSE", request);

  if (request._source === "bg") {
  console.log("INJECT FORWARD SEND", request);
    let messageToPage = Object.assign({
      _source: "inject",
      callbackId: request.callbackId,
    }, request);

    window.postMessage(messageToPage, "*");
  }
});
