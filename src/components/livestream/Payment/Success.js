import React from "react";
import { Link } from "react-router-dom";
import {ImageIcon} from "elv-components-js";
import {inject, observer} from "mobx-react";
import AsyncComponent from "../../support/AsyncComponent";

import "../../../static/stylesheets/base/paymentGlobal.css";
import Logo from "../../../static/images/Logo.png";


@inject("rootStore")
@inject("siteStore")
@observer
class Success extends React.Component {

  render() {
    const params = window.location.href;
    let sessionId = params.substr(params.length - 66); // => "Tabs1"
    let sessionIdShort = params.substr(params.length - 8); // => "Tabs1"
    return (
      <div className="new-live-container">
        <div className="live-nav">
          <ImageIcon className="live-nav--logo" icon={Logo} label="Eluvio" />
        </div>





          <div className="success-root">
            <div className="payment-overview">
              <h1 className="payment-overview-title">Thank you for your order!</h1>
              <h2 className="payment-overview-p">We've received your order and are proccessing your payment! An email with your digital ticket will be sent to you shortly. </h2>
            </div>
            <div className="code-reveal">
              <div className="code-reveal__ticket">
                <h2 className="payment-overview-order">ORDER CONFIRMATION #</h2>
                <h2 className="payment-overview-order2">{sessionIdShort}</h2>
                {/* <h1 className="code-reveal__ticket__ticketdetail">Ticket Code:</h1>
                <h2 className="code-reveal__ticket__ticketdetail2">{this.props.rootStore.OTPCode} </h2> */}
                <div className="sr-section completed-view">
                  <Link to="/rita-ora/d457a576" className="btn2 btn2--darkblue buttonguy">Back To Event</Link>
                </div>
              </div>
            </div>

        </div>
      </div>
    );
  }
}


export default Success;