import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {inject, observer} from "mobx-react";

import "./normalize.css";
import "./global.css";
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';

import artist1 from "../../../static/images/livestream/artist1.png";
import Logo from "../../../static/images/Logo.png";
import {ImageIcon} from "elv-components-js";

const formatPrice = ({ amount, currency, quantity }) => {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for(let part of parts) {
    if(part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / 100;
  const total = (quantity * amount).toFixed(2);
  return numberFormat.format(total);
};

@inject("rootStore")
@inject("siteStore")
@observer
class CheckoutForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      priceId: "price_1HPbPYKgR5J3zPrLcOd9Vz2u",
      basePrice: 999,
      currency: "usd",
      quantity: 1,
      price: formatPrice({
        amount: 999,
        currency: "usd",
        quantity: 1,
      }),
      loading: false,
      error: null,
    };
  }
  
  handleSubmit = async (event) => {
    event.preventDefault();
    const stripe = await loadStripe("pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N");

    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: "price_1HPbPYKgR5J3zPrLcOd9Vz2u", quantity: 1 }],
      successUrl: `https://core.test.contentfabric.io/prod/site-sample-live/#/success`,
      cancelUrl: `https://core.test.contentfabric.io/prod/site-sample-live/#/`,
      // successUrl: `${window.location.origin}/#/success`,
      // cancelUrl: `${window.location.origin}/#/`,
    });
    if (error) {
      console.error("Failed to handleSubmit for Stripe:");
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  

  render() {
    return (
      <div className="new-live-container">
        <div className="live-nav">
          <ImageIcon className="live-nav--logo" icon={this.props.siteStore.logoUrl ? this.props.siteStore.logoUrl : Logo} label="Eluvio" />
        </div>
        <div className="sr-root">
          <div className="sr-main">


            <section className="container">
              <div>
                <h1>Purchase a Ticket</h1>
                <h4>{this.props.location.state ? this.props.location.state.name : 'Artist'} Live At Bill Graham </h4>
                <div className="pasha-image">
                  <img
                    alt="Random asset from Picsum"
                    src={this.props.location.state ? this.props.location.state.icon : artist1}
                    width="310"
                    height="280"
                  />
                </div>
              </div>

  
              <button role="link" onClick={this.handleSubmit} className="payment-button">
                Buy with Credit Card
              </button>
              <button className="payment-button">
                <a className="coinbase buy-with-crypto" data-cache-disabled="true"
                  href={this.props.location.state ? this.props.location.state.url : this.props.rootStore.redirectCB}>
                  Buy with Crypto
                </a>
              </button>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutForm;
