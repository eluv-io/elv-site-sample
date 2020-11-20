import React from "react";
import {inject, observer} from "mobx-react";
import PremiereTabs from "../EventTabs";
import {ImageIcon} from "elv-components-js";
import CloseIcon from "../../../static/icons/x.svg";
import MaskedLogo from "../../../static/images/maskedLogo.png"
import {Redirect} from "react-router";

// import NavigationBar from "../navigation/NavigationBar";
import styled from "styled-components";
import Trailer from "../Trailer";
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
class Series extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      showTrailer: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // if(["series", "season"].includes(this.props.siteStore.singleTitle.title_type)){
    //   this.setState({isSeries: true});
    // }
  }

  Trailer() {

    let eventInfo = this.props.siteStore.eventAssets.get(this.props.match.params.name);
    let featuredTitle = eventInfo.stream;
    this.props.siteStore.PlayTrailer(featuredTitle);
    if (this.state.redirect) {
      let redirectLink = `/payment/${this.props.match.params.name}`;
      return <Redirect to={redirectLink} />;
    }

    return (
      <React.Fragment>
        
        <div onClick={() => this.setState({showTrailer: false})} className="backdrop" />

        <div className="modal show" >
          <ImageIcon
            key={`back-icon-Close Modal`}
            className={"back-button__modal"}
            title={"Close Modal"}
            icon={CloseIcon}
            onClick={() => this.setState({showTrailer: false})}
          />
          <div className={`modal__container`}>
            <Trailer/>
          </div>
        </div>
      </React.Fragment>

    )
  }


  render() {
    if (!this.props.siteStore.eventAssets.has(this.props.match.params.name)) {
      return <Redirect to='/'/>;
    }

    if (this.state.redirect) {
      let redirectLink = `/payment/${this.props.match.params.name}`;
      return <Redirect to={redirectLink} />;
    }

    let eventInfo = this.props.siteStore.eventAssets.get(this.props.match.params.name);
    let featuredTitle = eventInfo.stream;

    const thumbnail = eventInfo.icon;

    // const backgroundColor =  this.props.siteStore.siteCustomization.colors.background;
    const backgroundColor =  "#040622";

    const backgroundColor1 =  backgroundColor + "00";
    const backgroundColor2 =  backgroundColor + "4C";
    const backgroundColor3 =  backgroundColor+ "66";
    const backgroundColor4 =  backgroundColor + "B3";
    const backgroundColor5 =  backgroundColor + "CC";
    const backgroundColor6 =  backgroundColor+ "E6";


    const backgroundStyle = {
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(to bottom, ${backgroundColor1} 75%, ${backgroundColor3} 80%, ${backgroundColor4} 85%, ${backgroundColor5}  87%, ${backgroundColor6} 90%, ${backgroundColor} 100%), url(${thumbnail})`,
      backgroundPosition: "top",
      objectFit: "cover",
      height: "100%",
    };

    const customLogo = MaskedLogo;

    return (
      <div className="home-container">
        <div className="event-nav">
          <ImageIcon className="event-nav__container--logo" icon={this.props.siteStore.logoUrl ? this.props.siteStore.logoUrl : Logo} label="Eluvio" />
        </div>
        <div style={backgroundStyle} className="active-background" />
        <div className="active-view-container active-view-container__done">
            <div className="active-view-container__heading">
              {customLogo ? <ImageIcon className="logoSeries" icon={customLogo} label="logo"/>  : <h1 className="name"> {eventInfo.name} </h1>}
              <h1 className="premiereDate">Premiering { eventInfo.date}</h1>
              <h1 className="time">{ "New Episode every Friday at 7:00 PM PST" }</h1>
            </div>
            <div className="active-view-container__button">
              <button className="btnPlay btnDetails__heroPlay" onClick={() => this.setState({redirect: true})}>
                Buy Season    
              </button>
              
              <button onClick={() => this.setState({showTrailer: true})} className="btnPlay btnDetails__heroDetail">
                Watch Trailer
              </button>
            </div>

          <div className="active-view-container__overview">
            <PremiereTabs title={featuredTitle} type={"series"} name={this.props.match.params.name}/>
          </div>
        </div>
        { this.state.showTrailer ? this.Trailer(): null}
   

        <div className="live-footer">
          <h3 className="live-footer__title">
            Copyright © Eluvio 2020 
          </h3>
        </div>
      </div>
    );
  }
}

export default Series;