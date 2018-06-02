import React from "react";
import {hot} from "react-hot-loader";
import {Client} from "@tronscan/client";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {connect} from "react-redux";
import {logout, setAccount, setPrivateKey} from "../redux/actions";

const ONE_TRX = 1000000;

function Link({href, children, ...props}) {
  return (
    <a href="javascript:;" onClick={() => chrome.tabs.create({url: href})} {...props}>
      {children}
    </a>
  )
}

class Main extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      privateKey: "",
    };

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

  login = () => {

    let {privateKey} = this.state;

    if (this.isLoginValid()) {
      this.client.getAccountByAddress(pkToAddress(privateKey)).then(account => {
        console.log("GOT ACCOUNT", account);
        this.props.setAccount(account);
        this.props.setPrivateKey(privateKey);
      });
    }
  };

  logout = () => {
    this.props.logout();
  };

  render () {

    let {walletOpen, account} = this.props;

    return (
      <div>
        <div className="card border-0" style={{width: 320}}>
          {
            walletOpen ?
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
                  <Link href="https://tronscan.org/#/account" className="btn btn-dark btn-block btn-sm">Account</Link>
                </div>
                {
                  account.representative.enabled && (
                    <div className="dropdown-item text-danger text-center">
                      Representative
                    </div>
                  )
                }
                <hr/>
                <Link className="dropdown-item" href="https://tronscan.org/#/account">
                  <i className="fa fa-credit-card mr-2"/>
                  {account.balance / ONE_TRX} TRX
                </Link>
                <Link className="dropdown-item" href="https://tronscan.org/#/account">
                  <i className="fa fa-bolt mr-2"/>
                  {account.frozen.total / ONE_TRX} Tron Power
                </Link>
                <Link className="dropdown-item" href="https://tronscan.org/#/account">
                  <i className="fa fa-tachometer-alt mr-2"/>
                  {account.bandwidth.netRemaining} Bandwidth
                </Link>
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

const mapStateToProps = state => {
  return {
    privateKey: state.privateKey,
    account: state.account,
    walletOpen: state.walletOpen,
  };
};

const mapDispatchToProps = {
  setPrivateKey,
  setAccount,
  logout,
};

export default hot(module)(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main));
