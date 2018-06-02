import React from "react";
import {hot} from "react-hot-loader";
import {Client} from "@tronscan/client";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import Lockr from "lockr";

const ONE_TRX = 1000000;

const background = chrome.extension.getBackgroundPage();

class Main extends React.Component {

  constructor(props) {
    super(props);

    // this.fileRef = React.createRef();

    this.state = {
      privateKey: "",
      activePrivateKey: Lockr.get("activePrivateKey", ""),
      account: Lockr.get("account", null),
      isLoggedIn: Lockr.get("isLoggedIn", false),
    };

    background.privateKey = this.state.activePrivateKey;

    this.client = new Client({
      apiUrl: "https://api.tronscan.org"
    });
  }

  isLoginValid = () => {
    let {privateKey} = this.state;

    if (!privateKey || privateKey.length === 0) {
      return false;
    }

    if (privateKey.length !== 64) {
      return false;
    }

    return true;
  };

  componentDidMount() {

  }

  login = () => {

    let {privateKey} = this.state;

    if (this.isLoginValid()) {
      this.client.getAccountByAddress(pkToAddress(privateKey)).then(account => {
        Lockr.set("activePrivateKey", privateKey);
        Lockr.set("isLoggedIn", true);
        Lockr.set("account", account);
        background.privateKey = privateKey;
        this.setState({
          activePrivateKey: privateKey,
          isLoggedIn: true,
          account,
        });
      });
    }
  };

  logout = () => {
    this.setState({
      activePrivateKey: null,
      isLoggedIn: false,
    });
    background.privateKey = null;
  };

  onFileSelected() {

  }

  selectFile() {

  }

  render () {

    let {message, isLoggedIn, account} = this.state;

    return (
      <div>
        <div className="card border-0" style={{width: 320}}>
          {
            isLoggedIn ?
              <div className="card-body p-1">
                <div className="px-1 py-1">
                  <div className="row">
                    <div className="col-lg-10">
                      <b>{account.name || "Account"}</b>
                      <br/>
                      <span className="small text-truncate text-nowrap d-sm-inline-block" style={{width: 150}}>
                        {account.address}
                      </span>
                    </div>
                  </div>
                  <a href="https://api.tronscan.org/#/account" className="btn btn-dark btn-block btn-sm">Account</a>
                </div>
                {
                  account.representative.enabled && (
                    <div className="dropdown-item text-danger text-center">
                      Representative
                    </div>
                  )
                }
                <li className="dropdown-divider"/>
                <a className="dropdown-item" href="https://api.tronscan.org/#/account">
                  <i className="fa fa-credit-card mr-2"/>
                  {account.balance / ONE_TRX} TRX
                </a>
                <a className="dropdown-item" href="https://api.tronscan.org/#/account">
                  <i className="fa fa-bolt mr-2"/>
                  {account.frozen.total / ONE_TRX} Tron Power
                </a>
                <a className="dropdown-item" href="https://api.tronscan.org/#/account">
                  <i className="fa fa-tachometer-alt mr-2"/>
                  {account.bandwidth.netRemaining} Bandwidth
                </a>
                <hr />
                <div className="px-2 pt-1">
                  <button className="btn btn-danger btn-block" onClick={this.logout}>Sign Out</button>
                </div>
              </div> :
              <div className="card-body">
                <div className="form-group text-center">
                  <label>Private Key</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={ev => this.setState({ privateKey: ev.target.value })}
                    placeholder=""/>
                </div>
                <button className="btn btn-success btn-block"
                        disabled={!this.isLoginValid()}
                        onClick={this.login}>
                  Sign In
                </button>
              </div>
          }

        </div>
      </div>
    )
  }
}

export default hot(module)(Main)
