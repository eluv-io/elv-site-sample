import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import FallbackIcon from "../../static/icons/video.svg";
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
class SwiperTitleIcon extends React.Component {

  PlayVideo(title) {
    this.props.siteStore.PlayTitle(title);
    this.props.siteStore.OffSingleTitle();
  }

  render() {

    //Getting metadata:
    const title = this.props.title;

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const thumbnail = this.props.siteStore.CreateLink(
      title.landscapeUrl || title.imageUrl,
      "",
      { height: Math.max(150, Math.floor(vh / 3)) }
    );

    return (
      <Link to={`/${this.props.siteStore.siteParams.objectId}/overview/${FormatName(title.displayTitle)}`} className={this.props.isPoster ? "swiper-slide swiper-slide__poster swiper-container--movie" : "swiper-slide swiper-container--movie"}onClick={() => {this.props.shouldPlay ? this.PlayVideo(title): this.props.siteStore.SetSingleTitle(title);}} >
        {/* <div
          onClick={() => {this.props.shouldPlay ? this.PlayVideo(title): this.props.siteStore.SetSingleTitle(title);}}
        > */}
          <ImageIcon
            className="swiper-slide__image"
            icon= {this.props.isPoster ? (title.portraitUrl || thumbnail || FallbackIcon) : (thumbnail || FallbackIcon) }
            alternateIcon={FallbackIcon}
          />
          <h3 className={this.props.isPoster ? "swiper-slide__title hide" : "swiper-slide__title"}>
            { this.props.isEpisode ? `Episode ${this.props.episode + 1}: ${title.displayTitle}` : (this.props.trailers ? `Preview: ${title.displayTitle}` : `${title.displayTitle}`)}
          </h3>
        {/* </div> */}
      </Link>
    );
  }
}

SwiperTitleIcon.propTypes = {
  title: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired
};

export default SwiperTitleIcon;
