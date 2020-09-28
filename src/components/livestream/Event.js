import React from "react";
import {inject, observer} from "mobx-react";
// import Logo from "../../static/images/Logo.png";
import Logo from "../../static/images/fox/foxLogo.png";

import {ImageIcon} from "elv-components-js";
import background from "../../static/images/livestream/brand-ev.jpg";
import styled from "styled-components";

import liamE from "../../static/images/livestream/liam-event.png";
import brandE from "../../static/images/livestream/brand-ev.jpg";
import perfE from "../../static/images/livestream/perf-ev.jpg";
import kotaE from "../../static/images/livestream/kota-ev.jpg";
import oriE from "../../static/images/livestream/ori-ev.jpeg";
import walkE from "../../static/images/livestream/walk-new.jpg";

import tv1 from "../../static/images/fox/masked-singer.jpg";
import tvmasked from "../../static/images/fox/masked.jpg";
import tv24hours from "../../static/images/fox/24hours.jpg";
import tvfamily from "../../static/images/fox/familyposter.jpg";
import tvcosmos from "../../static/images/fox/cosmos.jpg";
import tvnhra from "../../static/images/fox/nhra.jpg";

import tvfootball from "../../static/images/fox/footballTNF.jpg";
import {
  Link
} from "react-router-dom";

@inject("rootStore")
@inject("siteStore")
@observer
class Event extends React.Component {
  componentWillMount() {
    window.scrollTo(0,0);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  componentDidUpdate() {
    window.scrollTo(0,0);
  }

  render() {
    let artist;
    let event;
    let description;

    switch(this.props.match.params.artist) {
      case "maskedsinger":
        artist = "The Masked Singer";
        event = tv1;
        description = "S3 E22 - Couldn't Mask for Anything More: The Grand Finale!";
        break;
      case "24hours":
        artist = "Gordon Ramsay's 24 Hours";
        event = tv24hours;
        description = "S2 E22 - Gordon Ramsay's 24 Hours to Hell and Back";

        break;
      case "family":
        artist = "Family Guy";
        event = tvfamily;
        description = "S18 E16 - Start Me Up";
        break;
      case "cosmos":
        artist = "Cosmos - Possible Worlds";
        event = tvcosmos;
        description = "S3 E1 - Ladder to the Stars";
        break;
      case "nhra":
        artist = "NHRA Drag Racing";
        event = tvnhra;
        description = "NHRA Drag Racing - Gainesville";
        break;
      case "tnf":
        artist = "Thursday Night Football";
        event = tvfootball;
        description = "Denver Broncos vs. NY Jets";
        break;
      default:
        artist = "TV";
        event = tv1;
        description = "Live TV";
    }

    const BackgroundStyleContainer = styled.div`
      background-size: cover;
      background-image: url(${event});
      height: 83.5vh;
      background-position: top;
      @media only screen and (max-width: 750px) {
        height: 65vh;
      }
      }
    `;

    return (
      <div className="event-container">
        <div className="event-nav">
          <ImageIcon className="event-nav__container--logo" icon={Logo} label="Eluvio" />
        </div>

        <BackgroundStyleContainer />


        <div className="event-container__info">
          <div className="event-container__info__title">
            {artist} - Schedule
          </div>

          <div className="event-container__info__schedule">
            <div className="event-container__info__schedule__post">
              <h4 className="event-container__info__schedule__post__detail">Sep 28 · 7:00 PM PDT </h4>

              <h4 className="event-container__info__schedule__post__detail">{description} </h4>
              <Link 
                to={`/payment/${this.props.match.params.artist}`} 
                >
                <button type="button" className="btn2 btn2--white btn3 btn3--white" onClick={() => this.props.siteStore.SetArtist(artist, event)}>Buy Ticket</button>
              </Link>
            </div>
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

export default Event;