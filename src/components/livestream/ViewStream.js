import React from "react";
import HLSPlayer from "hls.js";
import DashJS from "dashjs";
import {inject, observer} from "mobx-react";
import poster from "../../static/images/livestream/masked-singer.jpg";

@inject("siteStore")
@observer
class ViewStream extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showControls: false,
    };

    this.InitializeVideo = this.InitializeVideo.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.DestroyPlayer();
  }

  DestroyPlayer() {
    if(this.player) {
      this.player.destroy ? this.player.destroy() : this.player.reset();
    }
  }

  Schedule() {
    return {};
  }

  InitializeVideo(element) {
    if(!element) { return; }

    this.DestroyPlayer();

    try {
      element.addEventListener("canplay", () => this.setState({showControls: true}));
      let title = this.props.siteStore.streamPlay;
      const offering = title.currentOffering;
      let playoutOptions = title.playoutOptions;

      if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

      playoutOptions = playoutOptions[offering];

      let player;
      if(this.props.siteStore.dashSupported && playoutOptions.dash) {
        // DASH

        player = DashJS.MediaPlayer().create();

        const playoutUrl = (playoutOptions.dash.playoutMethods.widevine || playoutOptions.dash.playoutMethods.clear).playoutUrl;
        if(playoutOptions.dash.playoutMethods.widevine) {
          const widevineUrl = playoutOptions.dash.playoutMethods.widevine.drms.widevine.licenseServers[0];

          player.setProtectionData({
            "com.widevine.alpha": {
              "serverURL": widevineUrl
            }
          });
        }

        player.initialize(element, playoutUrl);
      } else {
        // HLS

        // Prefer AES playout
        const playoutUrl = (playoutOptions.hls.playoutMethods["aes-128"] || playoutOptions.hls.playoutMethods.clear).playoutUrl;

        if(!HLSPlayer.isSupported()) {
          element.src = playoutUrl;
          return;
        }

        const player = new HLSPlayer();
        player.loadSource(playoutUrl);
        player.attachMedia(element);
      }

      this.player = player;
      this.video = element;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  render() {
    const title = this.props.siteStore.streamPlay;
    console.log(title);

    return (
      <video
        key={`active-title-video-${title.titleId}-${title.currentOffering}`}
        ref={this.InitializeVideo}
        autoPlay
        // poster={poster}
        controls={this.state.showControls}
        className={"stream-container__streamBox--video"}
      />
    );
  }
}

export default ViewStream;