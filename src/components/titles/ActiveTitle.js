import React from "react";
//import HLSPlayer from "../../../node_modules/hls.js/dist/hls";
import HLSPlayer from "hls-fix";
import DashJS from "dashjs";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";

import FallbackIcon from "../../static/icons/video.svg";
import {InitializeFairPlayStream} from "../../FairPlay";

@inject("siteStore")
@observer
class ActiveTitle extends React.Component {
  constructor(props) {
    super(props);

    const hasLocalization = Object.keys(this.props.siteStore.localization.territories).length > 0;

    this.state = {
      useBitmovin: !hasLocalization,
      protocol: "dash",
      native: false,
      audioTracks: {
        current: -1,
        available: []
      },
      textTracks: {
        current: -1,
        available: []
      },
      showControls: false,
      activeTab: "Video",
      tabs: ["Video", "Details", "Metadata"]
    };

    this.InitializeVideo = this.InitializeVideo.bind(this);
    this.InitializeBitmovinVideo = this.InitializeBitmovinVideo.bind(this);
  }

  componentWillMount() {
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

  Tabs() {
    return (
      <nav className="tabs">
        {
          this.state.tabs.map(tab =>
            <button
              key={`active-title-tab-${tab}`}
              className={tab === this.state.activeTab ? "active-tab" : ""}
              onClick={() => {
                this.setState({activeTab: tab});
                if(this.video) {
                  this.video.pause();
                }
              }}
            >
              { tab }
            </button>
          )
        }
      </nav>
    );
  }

  async InitializeBitmovinVideo(element) {
    if(!element) { return; }

    this.DestroyPlayer();

    try {
      const configuration = {
        key: EluvioConfiguration["bitmovinLicenseKey"],
        playback: {
          muted: false,
          autoplay: true,
        }
      };

      const offering = this.props.siteStore.activeTitle.currentOffering;
      let playoutOptions = this.props.siteStore.activeTitle.bitmovinPlayoutOptions;

      if(!offering || !playoutOptions || !playoutOptions[offering]) {
        return;
      }

      playoutOptions = playoutOptions[offering];

      const player = new bitmovin.player.Player(element, configuration);

      await player.load({...playoutOptions});

      this.player = player;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  InitializeVideo(element) {
    if(!element) { return; }

    this.DestroyPlayer();

    this.video = element;

    try {
      element.addEventListener("canplay", () => this.setState({showControls: true}));

      const offering = this.props.siteStore.activeTitle.currentOffering;
      let playoutOptions = this.props.siteStore.activeTitle.playoutOptions;

      if(!offering || !playoutOptions || !playoutOptions[offering]) { return; }

      playoutOptions = playoutOptions[offering];

      let initialized = false;
      const InitializeTracks = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        if(!initialized) {
          this.InitializeTracks();
          initialized = true;
        }
      };

      let player;
      if(this.props.siteStore.dashSupported && playoutOptions.dash) {
        // DASH

        this.setState({protocol: "dash"});

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

        player.on(
          DashJS.MediaPlayer.events.CAN_PLAY,
          () => {
            this.setState({
              audioTracks: {
                current: player.getCurrentTrackFor("audio").index,
                available: player.getTracksFor("audio").map(audioTrack =>
                  ({
                    index: audioTrack.index,
                    label: audioTrack.labels && audioTrack.labels.length > 0 ? audioTrack.labels[0].text : audioTrack.lang,
                    language: audioTrack.lang
                  })
                )
              }
            }, InitializeTracks);
          }
        );

        player.on(
          DashJS.MediaPlayer.events.TEXT_TRACK_ADDED,
          () => {

            const available = player.getTracksFor("text").map(textTrack =>
              ({
                index: textTrack.index,
                label: textTrack.labels && textTrack.labels.length > 0 ? textTrack.labels[0].text : textTrack.lang,
                language: textTrack.lang
              })
            );

            this.setState({
              textTracks: {
                current: available.findIndex(track => track.index === player.getCurrentTrackFor("text").index),
                available
              }
            });
          }
        );

        player.initialize(element, playoutUrl);
      } else {
        // HLS

        this.setState({protocol: "hls"});

        if(!HLSPlayer.isSupported()) {
          if(
            this.props.siteStore.availableDRMs.includes("fairplay") &&
            playoutOptions.hls.playoutMethods.fairplay
          ) {
            InitializeFairPlayStream({playoutOptions, video: element});
          } else {
            // Prefer AES playout
            element.src = (
              playoutOptions.hls.playoutMethods["sample-aes"] ||
              playoutOptions.hls.playoutMethods["aes-128"] ||
              playoutOptions.hls.playoutMethods.clear
            ).playoutUrl;
          }

          this.setState({native: true});

          return;
        }

        // Prefer AES playout
        const playoutUrl = (
          playoutOptions.hls.playoutMethods["aes-128"] ||
          playoutOptions.hls.playoutMethods.clear
        ).playoutUrl;

        player = new HLSPlayer({
          maxBufferLength: 30,
          maxBufferSize: 300,
          enableWorker: true
        });

        player.on(HLSPlayer.Events.AUDIO_TRACK_LOADED, InitializeTracks);

        player.on(HLSPlayer.Events.AUDIO_TRACK_SWITCHED, () => {
          this.setState({
            audioTracks: {
              current: player.audioTrack,
              available: player.audioTrackController.tracks.map(audioTrack =>
                ({
                  index: audioTrack.id,
                  label: audioTrack.name,
                  language: audioTrack.lang
                })
              )
            }
          });
        });

        player.on(HLSPlayer.Events.SUBTITLE_TRACK_LOADED, () => {
          this.setState({
            textTracks: {
              current: player.subtitleTrack,
              available: Array.from(this.video.textTracks)
            }
          });
        });

        player.on(HLSPlayer.Events.SUBTITLE_TRACK_SWITCH, () => {
          this.setState({
            textTracks: {
              current: player.subtitleTrack,
              available: Array.from(this.video.textTracks)
            }
          });
        });

        player.loadSource(playoutUrl);
        player.attachMedia(element);
      }

      this.player = player;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  InitializeTracks() {
    const textTrackIndex = this.state.textTracks.available.findIndex(track =>
      (track.language || "").toLowerCase() === (this.props.siteStore.language || "").toLowerCase()
    );

    if(textTrackIndex >= 0) {
      this.SetTextTrack(textTrackIndex);
    } else {
      const defaultTextTrackIndex = this.state.textTracks.available.findIndex(track =>
        (track.language || "").toLowerCase() === "en"
      );

      if(defaultTextTrackIndex) {
        this.SetTextTrack(defaultTextTrackIndex);
      }
    }

    const audioTrack = this.state.audioTracks.available.find(track =>
      (track.language || "").toLowerCase() === (this.props.siteStore.language || "").toLowerCase()
    );

    if(audioTrack) {
      this.SetAudioTrack(audioTrack.index);
    } else {
      const defaultAudioTrack = this.state.audioTracks.available.find(track =>
        (track.language || "").toLowerCase() === "en"
      );

      if(defaultAudioTrack) {
        this.SetAudioTrack(defaultAudioTrack.index);
      }
    }
  }

  SetAudioTrack(index) {
    index = parseInt(index);

    if(this.state.protocol === "hls") {
      this.player.audioTrack = index;
    } else {
      const track = this.player.getTracksFor("audio").find(track => track.index === index);

      this.player.setCurrentTrack(track);
    }

    this.setState({
      audioTracks: {
        available: this.state.audioTracks.available,
        current: index
      }
    });
  }

  SetTextTrack(index) {
    if(this.state.protocol === "hls") {
      this.player.subtitleTrack = index;
    } else {
      this.player.setTextTrack(index);
    }

    this.setState({
      textTracks: {
        available: this.state.textTracks.available,
        current: index
      }
    });
  }

  Tracks() {
    if(this.state.native || !this.player || (this.state.audioTracks.available.length <= 1 && this.state.textTracks.available.length === 0)) {
      return null;
    }

    let textTrackSelection;
    if(this.state.textTracks.available.length > 0) {
      textTrackSelection = (
        <select
          aria-label="Subtitle Track"
          value={this.state.textTracks.current}
          className="video-playback-control"
          onChange={event => this.SetTextTrack(parseInt(event.target.value))}
        >
          <option value={-1}>Subtitles: None</option>
          {
            this.state.textTracks.available.map((track, index) => {
              let label;
              try {
                label = this.state.protocol === "dash" ?
                  this.player.getTracksFor("text")[index].labels[0].text :
                  track.label;
              } catch (error) {
                label = track.lang;
              }

              return (
                <option value={index} key={`audio-track-${index}`}>
                  Subtitles: { label }
                </option>
              );
            })
          }
        </select>
      );
    }

    let audioTrackSelection;
    if(this.state.audioTracks.available.length > 1) {
      audioTrackSelection = (
        <select
          aria-label="Audio Track"
          value={this.state.audioTracks.current}
          className="video-playback-control"
          onChange={event => this.SetAudioTrack(parseInt(event.target.value))}
        >
          {
            this.state.audioTracks.available.map(({index, label}) =>
              <option value={index} key={`audio-track-${index}`}>Audio: {label}</option>
            )
          }
        </select>
      );
    }

    return (
      <React.Fragment>
        { textTrackSelection }
        { audioTrackSelection }
      </React.Fragment>
    );
  }

  Offerings() {
    const availableOfferings = this.props.siteStore.activeTitle.availableOfferings;

    if(!availableOfferings || Object.keys(availableOfferings).length < 2) {
      return null;
    }

    return (
      <select
        className="active-title-offerings"
        onChange={event => this.props.siteStore.LoadActiveTitleOffering(event.target.value)}
      >
        {Object.keys(availableOfferings).map(offeringKey =>
          <option key={`offering-${offeringKey}`} value={offeringKey}>
            Offering: { availableOfferings[offeringKey].display_title || offeringKey }
          </option>
        )}
      </select>
    );
  }

  MetadataPage() {
    const title = this.props.siteStore.activeTitle;

    return (
      <div className={`active-title-metadata ${this.state.activeTab === "Metadata" ? "" : "hidden"}`}>
        <h2>{ title.title } - Metadata</h2>
        <div className="metadata-path">{title.isSearchResult ? "" : this.props.siteStore.currentSite.name + " - "}{title.baseLinkPath}</div>
        <pre>
          { JSON.stringify(title.metadata, null, 2)}
        </pre>
      </div>
    );
  }

  DetailsPage() {
    const title = this.props.siteStore.activeTitle;

    const titleInfo = title.info || {};

    let genre = titleInfo.genre;
    if(!Array.isArray(genre)) {
      genre = [genre];
    }

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`active-title-details-page ${this.state.activeTab === "Details" ? "" : "hidden"}`}>
        <ImageIcon icon={title.portraitUrl || title.imageUrl || title.landscapeUrl || FallbackIcon} alternateIcon={FallbackIcon} className="active-title-detail-image" title="Poster" />
        <div className="active-title-details">
          <h2>{ title.title }</h2>
          {Maybe(
            titleInfo.synopsis,
            () => <div className="synopsis">{ titleInfo.synopsis }</div>
          )}
          <div className="details-section">
            {Maybe(
              titleInfo.talent && titleInfo.talent.cast,
              () => <div className="detail">
                <label>Cast</label>
                { titleInfo.talent.cast.map(actor => `${actor.talent_first_name} ${actor.talent_last_name}`).join(", ") }
              </div>
            )}
            {Maybe(
              titleInfo.runtime,
              () => <div className="detail">
                <label>Runtime</label>
                { titleInfo.runtime } minutes
              </div>
            )}
            {Maybe(
              titleInfo.release_date,
              () => <div className="detail">
                <label>Release Date</label>
                { new Date(titleInfo.release_date).toLocaleDateString(this.props.siteStore.language || "en-US", {year: "numeric", month: "long", day: "numeric"}) }
              </div>
            )}
            {Maybe(
              genre,
              () => <div className="detail">
                <label>Genre</label>
                { genre.join(", ") }
              </div>
            )}
            {Maybe(
              titleInfo.creator,
              () => <div className="detail">
                <label>Creator</label>
                { titleInfo.creator }
              </div>
            )}
          </div>
          {Maybe(
            titleInfo.copyright,
            () => <div className="copyright">
              { titleInfo.copyright.toString().startsWith("©") ? "" : "©" } { titleInfo.copyright}
            </div>
          )}
        </div>
      </div>
    );
  }

  VideoPage() {
    const title = this.props.siteStore.activeTitle;

    let displayTitle = title.title;
    let synopsis = (title.info || {}).synopsis || "";

    // Include poster image to pre-load it for details page
    return (
      <div className={`active-title-video-page ${this.state.activeTab === "Video" ? "" : "hidden"}`}>
        <ImageIcon icon={title.portraitUrl || title.imageUrl || title.landscapeUrl} className="hidden" />

        {
          this.state.useBitmovin ?
            <div
              className="video"
              key={`active-title-video-${title.titleId}-${title.currentOffering}`}
              ref={this.InitializeBitmovinVideo}
            /> :
            <video
              key={`active-title-video-${title.titleId}-${title.currentOffering}`}
              ref={this.InitializeVideo}
              autoPlay
              controls={this.state.showControls}
            />
        }

        <div className="video-info">
          <div className="video-options">
            { this.Tracks() }
            { this.Offerings() }
          </div>
          <h4>
            { displayTitle.toString() }
          </h4>
          <div className="synopsis">
            { synopsis.toString() }
          </div>
        </div>
      </div>
    );
  }

  render() {
    if(!this.props.siteStore.activeTitle) { return null; }

    return (
      <div className="active-title">
        { this.Tabs() }
        { this.VideoPage() }
        { this.DetailsPage() }
        { this.MetadataPage() }
      </div>
    );
  }
}

export default ActiveTitle;
