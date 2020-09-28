import React from "react";
import {inject, observer} from "mobx-react";
import Logo from "../../static/images/fox/foxLogo.png";
import {ImageIcon} from "elv-components-js";
import Card from "./Card";

import tv1 from "../../static/images/fox/masked-singer.jpg";
import tvmasked from "../../static/images/fox/masked.jpg";
import tv24hours from "../../static/images/fox/24hours.jpg";
import tvfamily from "../../static/images/fox/family.jpg";
import tvcosmos from "../../static/images/fox/cosmos.jpg";

import tvnhra from "../../static/images/fox/nhra.jpg";
import tvfootball from "../../static/images/fox/footballTNF.jpg";
import { Link } from "react-router-dom";

@inject("rootStore")
@inject("siteStore")
@observer
class Home extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    window.scrollTo(0,0);
  }

  render() {

    return (
      <div className="live-container">

        {/* NavBar */}
        <div className="live-nav">
          <ImageIcon className="live-nav--logo" icon={Logo} label="Eluvio" />
          <Link to="/code" className="btn2 btn2--white live-nav--ticket">
            Redeem Ticket 
          </Link>
        </div>

        {/* Hero View */}
        <div className="live-hero">
          <div className="live-hero__container">
            <h1 className="live-hero__container__title">
                {/* Live Concerts From your home. */}
                All Your Live TV In One Place.
            </h1>
            <h2 className="live-hero__container__subtitle">
                Purchase livestream tickets for your favorite FOX TV Shows and Live Sports.
            </h2>
          </div>
          
          <div className="live-hero__cardMain">
            <div className="live-hero__cardMain__side">
              <ImageIcon className="live-hero__picture" icon={tv1} label="artist" />
              {/* <h4 className="live-hero__heading">
                <span className="live-hero__heading-span card__heading-span--4">The Masked Singer</span>
              </h4> */}
            </div>
          </div>
        </div>

        {/* Content Selection */}
        <div className="live-content">
          <div className="live-content__title">
            Live TV
          </div>

          <div className="live-content__container">
            <Card
              name={"maskedsinger"}
              artist={"The Masked Singer"}
              date={"Sep 28 · 7:00 PM PDT"}
              description={"S3 E22 - Couldn't Mask for Anything More: The Grand Finale!"}
              icon={tvmasked}
            />
            <Card
              name={"24hours"}
              artist={"Gordon Ramsay's 24 Hours"}
              date={"Sep 29 · 5:00 PM PDT"}
              description={"S2 E22 - Gordon Ramsay's 24 Hours to Hell and Back"}
              icon={tv24hours}
            />
            <Card
              name={"family"}
              artist={"Family Guy"}
              date={"Sep 30 · 7:30 PM PDT"}
              description={"S18 E16 - Start Me Up"}
              icon={tvfamily}
            />
            <Card
              name={"cosmos"}
              artist={"Cosmos - Possible Worlds"}
              date={"Oct 4 · 10:00 PM PDT"}
              description={"S3 E1 - Ladder to the Stars"}
              icon={tvcosmos}
            />
          </div>
        </div>
        <div className="live-content">
          <div className="live-content__title">
            Live Sports
          </div>

          <div className="live-content__container">
            <Card
              name={"nhra"}
              artist={"NHRA Drag Racing"}
              date={"Sep 30 · 7:30 PM PDT"}
              description={"NHRA Drag Racing - Gainesville"}
              icon={tvnhra}
            />
            <Card
              name={"tnf"}
              artist={"Thursday Night Football"}
              date={"Oct 1 · 8:20 PM PDT"}
              description={"Denver Broncos vs. NY Jets"}
              icon={tvfootball}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="live-footer">
          <h3 className="live-footer__title">
            Copyright © Eluvio 2020 
          </h3>
        </div>

      </div>
    );
  }
}

export default Home;