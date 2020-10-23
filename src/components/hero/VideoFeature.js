import React from "react";
import {inject, observer} from "mobx-react";
import SubscriptionPayment from "../payment/SubscriptionPayment";
import {ImageIcon} from "elv-components-js";
import ViewTrailer from "../video/ViewTrailer";
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
class VideoFeature extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: false,
      trailer: null
    };
  }

  async componentDidMount() {
    await this.props.siteStore.LoadAsset(this.props.title.baseLinkPath);
    const title = this.props.siteStore.assets[this.props.title.versionHash];
    const trailer = title.trailers.default;
    await this.props.siteStore.LoadAsset(trailer.baseLinkPath);
    this.props.siteStore.PlayTrailer(trailer);
  }

  preSubscribe() {
    return <SubscriptionPayment isNav={false} isFeature={true}/>;
  }

  afterSubscribe() {
    return (
      <button onClick={() => this.props.siteStore.PlayTitle(this.props.title)} className={"btnPlay btnPlay__feature"}>
        WATCH NOW
      </button>
    );
  }

  ShowVideo() {
    return <ViewTrailer key={`active-title-${this.props.siteStore.activeTrailer.titleId}`} />;
  }
  
  render() {    
    const featuredTitle = this.props.title;

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    
    const customLogo = this.props.siteStore.CreateLink(
      featuredTitle.logoUrl,
      "",
      { height: Math.max(150, Math.min(Math.floor(vh), Math.floor(vw))) }
    );

    const backgroundStyle = {
      backgroundSize: "cover",
      marginTop: "7rem",

    };
    
    return (
      <div
        style={backgroundStyle}
        className= "video-feature"
      >
        { this.props.siteStore.activeTrailer ? this.ShowVideo() : null}

        <div className="video-feature__container">
          { customLogo ? <ImageIcon className="video-feature__titleIcon" icon={customLogo} label="logo"/> : <h1 className="video-feature__title"> {featuredTitle.displayTitle} </h1>}
          <div className="video-feature__button">
            <Link to={`/${this.props.siteStore.siteParams.objectId}/play/${FormatName(featuredTitle.displayTitle)}`} >
              { this.props.siteStore.boughtSubscription ? this.afterSubscribe() : this.preSubscribe()}
            </Link>

            <Link to={`/${this.props.siteStore.siteParams.objectId}/overview/${FormatName(featuredTitle.displayTitle)}`} >
              <button onClick={() => this.props.siteStore.SetSingleTitle(featuredTitle)} className="btnDetails btnDetails__featureDetail">
                  VIEW DETAILS
              </button>
            </Link>
          </div>
        </div>

      </div>

    );
  }
}

export default VideoFeature;