

export default class SignService {


  constructor() {
    this.requests = {};
  }

  requestSign(transaction) {

    return new Promise((resolve, reject) => {
      console.log("REQUEST FOR SIGN", transaction);

      let confirmationId = 'request_approval';

      this.requests[confirmationId] = { resolve, reject };

      chrome.notifications.create(confirmationId, {
        type: 'basic',
        iconUrl: require("../../img/icon-128.png"),
        title: 'Transacation Request',
        requireInteraction: true,
        message: 'Would you like to approve this transaction',
        buttons: [
          { title: "Approve" },
          { title: "Reject" },
        ]
      }, function(notificationId) {
        console.log("NOTIFICATION ID", notificationId);
      });
    });
  }

}
