import React, { useReducer } from "react";
import { loadStripe } from "@stripe/stripe-js";

import "./normalize.css";
import "./global.css";
// import artist1 from "../../../static/images/livestream/artist1.png";
// import artist2 from "../../../static/images/livestream/artist2.png";
// import artist3 from "../../../static/images/livestream/artist3.png";
// import artist4 from "../../../static/images/livestream/artist4.png";
// import artist5 from "../../../static/images/livestream/artist5.png";
// import artist6 from "../../../static/images/livestream/artist6.png";

import AsyncComponent from "../../AsyncComponent";

import tv1 from "../../../static/images/fox/masked-singer.jpg";
import tv24hours from "../../../static/images/fox/24hours.jpg";
import tvfamily from "../../../static/images/fox/familyposter.jpg";
import tvcosmos from "../../../static/images/fox/cosmos.jpg";
import tvnhra from "../../../static/images/fox/nhra.jpg";
import tvfootball from "../../../static/images/fox/footballTNF.jpg";

// import Logo from "../../../static/images/Logo.png";
import Logo from "../../../static/images/fox/foxLogo.png";
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';

import {ImageIcon} from "elv-components-js";

const stripePromise = loadStripe("pk_test_51Gy1tWKgR5J3zPrLdO0DgqBKqES5Kmfe7qlKYspFxoiZbGizeQIqh8uXfYqa45wIZGfChMn2R3tLhEwonIsWZHok00k4BiqN3N");

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

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        quantity: state.quantity + 1,
        price: formatPrice({
          amount: state.basePrice,
          currency: state.currency,
          quantity: state.quantity + 1,
        }),
      };
    case "decrement":
      return {
        ...state,
        quantity: state.quantity - 1,
        price: formatPrice({
          amount: state.basePrice,
          currency: state.currency,
          quantity: state.quantity - 1,
        }),
      };
    case "setLoading":
      return { ...state, loading: action.payload.loading };
    case "setError":
      return { ...state, error: action.payload.error };
    default:
      throw new Error();
  }
}


const Checkout = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    priceId: "price_1HWA0rKgR5J3zPrLoLl9QIXs",
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
  });

  const handleClick = async (event) => {
    // Call your backend to create the Checkout session.
    dispatch({ type: "setLoading", payload: { loading: true } });
    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: state.priceId, quantity: state.quantity }],
      successUrl: `https://core.test.contentfabric.io/prod/site-sample-live-fox/#/success`,
      cancelUrl: `https://core.test.contentfabric.io/prod/site-sample-live-fox/#/`,
      // successUrl: `${window.location.origin}/#/success`,
      // cancelUrl: `${window.location.origin}/#/`,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if(error) {
      dispatch({ type: "setError", payload: { error, event } });
      dispatch({ type: "setLoading", payload: { loading: false } });
    }
  };

  function renderSwitch(param) {
    switch(param) {
      case "maskedsinger":
        return "The Masked Singer";
        
      case "24hours":
        return "Gordon Ramsay's 24 Hours";
        
      case "family":
        return "Family Guy";
        
      case "cosmos":
        return "Cosmos - Possible Worlds";
        
      case "nhra":
        return "NHRA Drag Racing";
        
      case "tnf":
        return "Thursday Night Football";
        
      default:
        return "TV";
        
    }
  }
  function renderSwitchPhoto(param) {
    switch(param) {
      case "maskedsinger":
        return tv1;
      case "24hours":
        return tv24hours;
      case "family":
        return tvfamily;
      case "cosmos":
        return tvcosmos;
      case "nhra":
        return tvnhra;
      case "tnf":
        return tvfootball;
      default:
        return tv1;
    }
  }



  return (
    <div className="new-live-container">
      <div className="live-nav">
        <ImageIcon className="live-nav--logo" icon={Logo} label="Eluvio" />
      </div>
      <div className="sr-root">
        <div className="sr-main">


          <section className="container">
            <div>
              <h1>Purchase a Ticket</h1>
              <h4>{renderSwitch(window.location.href.substring(window.location.href.lastIndexOf('/') + 1))}  </h4>
              <div className="pasha-image">
                <img
                  alt="Random asset from Picsum"
                  src={renderSwitchPhoto(window.location.href.substring(window.location.href.lastIndexOf('/') + 1))}
                  width="310"
                  height="280"
                />
              </div>
            </div>
            {/* <div className="quantity-setter"> */}
              {/* <button
                className="increment-btn"
                disabled={state.quantity === 1}
                onClick={() => dispatch({ type: "decrement" })}
              >
                -
              </button> */}
              {/* <input
                type="number"
                id="quantity-input"
                min="1"
                max="10"
                value={state.quantity}
                readOnly
              /> */}
              {/* <button
                className="increment-btn"
                disabled={state.quantity === 10}
                onClick={() => dispatch({ type: "increment" })}
              >
                +
              </button> */}
            {/* </div> */}
            {/* <p className="sr-legal-text">Number of copies (max 10)</p> */}

            <button role="link" onClick={handleClick} disabled={state.loading} className="payment-button">
              {state.loading || !state.price
                ? "Loading..."
                : `Buy with Credit Card`}
            </button>
            <button className="payment-button">
              <a className="coinbase buy-with-crypto"
                href={props.location.state ? props.location.state.url : 'https://commerce.coinbase.com/checkout/d063763b-8833-4b12-b278-303b26da4192'}>                  Buy with Crypto
              </a>
            </button>

            {/* <div className="sr-field-error">{state.error?.message}</div> */}
          </section>
        </div>
      </div>
    </div>
  );
    
  
};

export default Checkout;
