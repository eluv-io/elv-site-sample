import React from "react";
import {inject, observer} from "mobx-react";
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import NoSpinAsync from "../../NoSpinAsync";
import {Redirect, Switch, withRouter} from "react-router";

@inject("rootStore")
@inject("siteStore")
@observer
class Coinbase extends React.Component {



  render() {
    function onSuccess(MessageData) {
      console.log("onSuccess!");
      console.log(MessageData);
      return <Redirect to="/success" />;
    }

    return (
      <NoSpinAsync
        Load={async () => {
          await this.props.rootStore.CreateCharge();
        }}
        render={() => {
          if(!this.props.rootStore.chargeID) { return null; }
          console.log(this.props.rootStore.chargeID);

          return (
            <button className="payment-button">
              <a className="coinbase buy-with-crypto"
                href={this.props.rootStore.redirectCB}>
                Buy with Crypto
              </a>
            </button>
          );
        }}
      />
    );
  }
}

export default Coinbase;