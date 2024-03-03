import React from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";
import {ImageIcon, LoadingElement} from "elv-components-js";
import FallbackIcon from "../../static/icons/video.svg";

@inject("rootStore")
@inject("siteStore")
@observer
class TitleIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.PlayTitle = this.PlayTitle.bind(this);
  }

  async PlayTitle(title) {
    try {
      this.setState({loading: true});
      //console.log(props);
      // Clicked 'title' is actually a collection
      if(["site", "series", "season"].includes(title.title_type)) {
        this.props.siteStore.LoadSite(title.objectId);

      } else {
        await this.props.siteStore.SetActiveTitle(title);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to set active title:");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.setState({loading: false});
    }
  }

  render() {
    const title = this.props.title;
    // console.log(title.title, title);

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const thumbnail = this.props.siteStore.CreateLink(
      title.landscapeUrl || title.imageUrl,
      "",
      { height: Math.max(150, Math.floor(vh / 3)) }
    );

    return (
      <div
        className={`title ${this.props.visible ? "" : "hidden-title"}`}
        onClick={() => this.PlayTitle(title)}
      >
        <div className="ar-container">
          <LoadingElement
            loadingClassname="title-loading-indicator"
            loading={this.state.loading}
            render={() => null}
          />
          <div className="title-vignette" />
          <ImageIcon
            className="title-image"
            icon={thumbnail || FallbackIcon}
            alternateIcon={FallbackIcon}
          />
        </div>
        <div>
          <h4>{ title.title }</h4>
        </div>
      </div>
    );
  }
}

TitleIcon.propTypes = {
  title: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired
};

export default TitleIcon;
