import React from "react";
import {inject, observer} from "mobx-react";
import PremiereTabs from "./PremiereTabs";
import {ImageIcon} from "elv-components-js";
import NavigationBar from "../navigation/NavigationBar";
import SubscriptionPayment from "../payment/SubscriptionPayment";

import {
  Link
} from "react-router-dom";

const FormatName = (name) => {
  return (name || "")
    .split(/[_, \s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

@inject("rootStore")
@inject("siteStore")
@observer
class ActiveTitle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSeries: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if(["series", "season"].includes(this.props.siteStore.singleTitle.title_type)){
      this.setState({isSeries: true});
    }
  }


  preSubscribe() {
    return <SubscriptionPayment isNav={false} />;
  }

  playPremiere() {
    return (
      <button onClick={() => this.props.siteStore.PlayTitle(this.props.siteStore.singleTitle)} className="btnPlay btnDetails__heroPlay">
        Play Now
      </button>
    );
  }
  
  RegularButtons() {
    return (
      <div className="active-view-container__button">
        <Link to={`/${this.props.siteStore.siteParams.objectId}/play/${FormatName(this.props.siteStore.singleTitle.displayTitle)}`}>

        { this.props.siteStore.boughtSubscription ? this.playPremiere() : this.preSubscribe()}

        <button onClick={() => this.props.siteStore.PlayTitle(this.props.siteStore.singleTitle)} className="btnPlay btnDetails__heroDetail">
          Watch Trailer
        </button>
        </Link>
      </div>
    );
  }

  

  render() {
    if(!this.props.siteStore.siteCustomization || (!this.props.rootStore.accessCode)) {
      return <Redirect to={`/code/iq__YfEF1A8sUvMj5WcMCJEDk4aEwND`} />;
    }

    const featuredTitle = this.props.siteStore.singleTitle;
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    const thumbnail = this.props.siteStore.CreateLink(
      featuredTitle.landscapeUrl || featuredTitle.imageUrl,
      "",
      { height: vh }
    );

    const backgroundColor =  this.props.siteStore.siteCustomization.colors.background;

    const backgroundColor1 =  backgroundColor + "00";
    const backgroundColor2 =  backgroundColor + "4C";
    const backgroundColor3 =  backgroundColor+ "66";
    const backgroundColor4 =  backgroundColor + "B3";
    const backgroundColor5 =  backgroundColor + "CC";
    const backgroundColor6 =  backgroundColor+ "E6";

    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 50%, ${backgroundColor2} 55%, ${backgroundColor3}  60%, ${backgroundColor4} 65%, ${backgroundColor5}  70%, ${backgroundColor6} 80%, ${backgroundColor} 85%), url(${thumbnail})`,
      backgroundPosition: "center"
    };
    const customLogo = this.props.siteStore.CreateLink(
      featuredTitle.logoUrl,
      "",
      { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
    );

    return (
      <div className="container">
        <NavigationBar />

        <div style={backgroundStyle} className="active-background" />
        <div className="active-view-container active-view-container__done">
          {/* <div className="active-view-container__overview">  */}
            { customLogo ? <ImageIcon className="active-view-container__logo" icon={customLogo} label="logo"/> : <h1 className="active-view-container__heading"> {featuredTitle.displayTitle} </h1>}
            { this.state.isSeries ? null : this.RegularButtons()}
          {/* </div> */}


          <div className="active-view-container__overview">
            <PremiereTabs title={featuredTitle}/>
          </div>
        </div>
        <div className="live-footer">
          <h3 className="live-footer__title">
            Copyright © Eluvio 2020 
          </h3>
        </div>
      </div>
    );
  }
}

export default ActiveTitle;