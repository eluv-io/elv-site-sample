import React from "react";
import HLSPlayer from "../../../node_modules/hls.js/dist/hls";
import DashJS from "dashjs";
import {inject, observer} from "mobx-react";
import {ImageIcon} from "elv-components-js";
import {DateTime} from "luxon";

import FallbackIcon from "../../static/icons/video.svg";
import {InitializeFairPlayStream} from "../../FairPlay";

@inject("siteStore")
@observer
class ChannelSchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startIndex: props.currentIndex || 0,
      visible: 5,
    };
  }

  ProgramIcon(program, index) {
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const thumbnail = this.props.siteStore.CreateLink(
      this.props.siteStore.activeTitle.baseLinkUrl,
      `channel_info/schedule/daily_schedules/${this.props.date}/${index}/program_image/thumbnail`,
      { height: Math.floor(vh / 2) }
    );

    const visible = index >= this.state.startIndex
      && index < this.state.startIndex + this.state.visible;

    const startTime = DateTime.fromMillis(program.start_time_epoch).toLocaleString(DateTime.TIME_SIMPLE);

    return (
      <div
        key={`title-${index}-${program.title}`}
        className={`title ${visible ? "" : "hidden-title"}`}
      >
        <div className="ar-container">
          { index === this.props.currentIndex ? <div className="current-program-indicator" /> : null }
          <div className="title-vignette" />
          <ImageIcon
            className="title-image"
            icon={thumbnail}
            alternateIcon={FallbackIcon}
          />
        </div>
        <h4>{program.title} - {startTime}</h4>
      </div>
    );
  }

  render() {
    if(!this.props.schedule) { return null; }

    const showLeft = this.state.startIndex !== 0;
    const showRight = this.state.startIndex + this.state.visible < this.props.schedule.length;

    return (
      <div className="title-reel-container channel-schedule-reel">
        <h3 className="title-reel-header">Schedule</h3>
        <div className="title-reel">
          <div
            className={`reel-arrow reel-arrow-left ${showLeft ? "" : "hidden"}`}
            onClick={event => {
              event.stopPropagation();
              this.setState({startIndex: this.state.startIndex - 1});
            }}
          >
            ➢
          </div>

          <div className="title-reel-titles">
            { this.props.schedule.map((program, i) => this.ProgramIcon(program, i)) }
          </div>

          <div
            className={`reel-arrow reel-arrow-right ${showRight ? "" : "hidden"}`}
            onClick={event => {
              event.stopPropagation();
              this.setState({startIndex: this.state.startIndex + 1});
            }}
          >
            ➢
          </div>
        </div>
      </div>
    );
  }
}

@inject("siteStore")
@observer
class ActiveTitle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

  Schedule() {
    return {};

    // eslint-disable-next-line no-unreachable
    const channel = this.props.siteStore.activeTitle;
    const date = DateTime.local().toFormat("yyyyLLdd");

    if(!channel.channel_info || !channel.channel_info.schedule || !channel.channel_info.schedule.daily_schedules) {
      return { date };
    }

    const schedule = channel.channel_info.schedule.daily_schedules[date] || [];

    const now = DateTime.local().ts;
    const currentIndex = schedule.findIndex(program =>
      program.start_time_epoch <= now &&
      (program.start_time_epoch + program.duration_sec * 1000) >= now
    );

    return {
      schedule,
      currentIndex: currentIndex >= 0 ? currentIndex : undefined,
      date
    };
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
                    label: audioTrack.labels && audioTrack.labels.length > 0 ? audioTrack.labels[0].text : audioTrack.lang
                  })
                )
              }
            });
          }
        );

        player.on(
          DashJS.MediaPlayer.events.TEXT_TRACK_ADDED,
          () => {

            const available = player.getTracksFor("text").map(textTrack =>
              ({
                index: textTrack.index,
                label: textTrack.labels && textTrack.labels.length > 0 ? textTrack.labels[0].text : textTrack.lang
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
          if(this.props.siteStore.availableDRMs.includes("fairplay")) {
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

        player = new HLSPlayer();

        player.on(HLSPlayer.Events.AUDIO_TRACK_SWITCHED, () => {
          this.setState({
            audioTracks: {
              current: player.audioTrack,
              available: player.audioTrackController.tracks.map(audioTrack =>
                ({
                  index: audioTrack.id,
                  label: audioTrack.name
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

  Tracks() {
    if(this.state.native || !this.player || (this.state.audioTracks.available.length <= 1 && this.state.textTracks.available.length === 0)) {
      return null;
    }

    let SetAudioTrack, SetTextTrack;
    if(this.state.protocol === "hls") {
      SetAudioTrack = event => {
        this.player.audioTrack = parseInt(event.target.value);
      };

      SetTextTrack = event => {
        const index = parseInt(event.target.value);
        this.player.subtitleTrack = index;

        this.setState({
          textTracks: {
            available: this.state.textTracks.available,
            current: index
          }
        });
      };
    } else {
      SetAudioTrack = event => {
        const index = parseInt(event.target.value);

        const track = this.player.getTracksFor("audio").find(track => track.index === index);

        this.player.setCurrentTrack(track);

        this.setState({
          audioTracks: {
            available: this.state.audioTracks.available,
            current: index
          }
        });
      };

      SetTextTrack = event => {
        const index = parseInt(event.target.value);

        this.player.setTextTrack(index);

        this.setState({
          textTracks: {
            available: this.state.textTracks.available,
            current: index
          }
        });
      };
    }

    let textTrackSelection;
    if(this.state.textTracks.available.length > 0) {
      textTrackSelection = (
        <select
          aria-label="Subtitle Track"
          value={this.state.textTracks.current}
          className="video-playback-control"
          onChange={SetTextTrack}
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
          onChange={SetAudioTrack}
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
        <h2>{ this.props.siteStore.Localized(title, "title") } - Metadata</h2>
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

    let genre = this.props.siteStore.Localized(title, "genre");
    if(!Array.isArray(genre)) {
      genre = [genre];
    }

    const Maybe = (value, render) => value ? render() : null;

    return (
      <div className={`active-title-details-page ${this.state.activeTab === "Details" ? "" : "hidden"}`}>
        <ImageIcon icon={title.portraitUrl || title.imageUrl || title.landscapeUrl || FallbackIcon} alternateIcon={FallbackIcon} className="active-title-detail-image" title="Poster" />
        <div className="active-title-details">
          <h2>{ this.props.siteStore.Localized(title, "title") }</h2>
          {Maybe(
            titleInfo.synopsis,
            () => <div className="synopsis">{ this.props.siteStore.Localized(title, "synopsis") }</div>
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
              { titleInfo.copyright.toString().startsWith("©") ? "" : "©" } { this.props.siteStore.Localized(title, "copyright") }
            </div>
          )}
        </div>
      </div>
    );
  }

  VideoPage() {
    const { schedule, currentIndex, date } = this.Schedule();

    const title = this.props.siteStore.activeTitle;

    let displayTitle = this.props.siteStore.Localized(title, "title");
    let synopsis = this.props.siteStore.Localized(title, "synopsis");
    if(currentIndex !== undefined) {
      const program = schedule[currentIndex];
      displayTitle = program.title || displayTitle;
      synopsis = program.description !== undefined ? program.description : synopsis;
    }

    // Include poster image to pre-load it for details page
    return (
      <div className={`active-title-video-page ${this.state.activeTab === "Video" ? "" : "hidden"}`}>
        <ImageIcon icon={title.portraitUrl || title.imageUrl || title.landscapeUrl} className="hidden" />
        <video
          key={`active-title-video-${title.titleId}-${title.currentOffering}`}
          ref={this.InitializeVideo}
          autoPlay
          controls={this.state.showControls}
        />
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
          <ChannelSchedule
            schedule={schedule}
            date={date}
            currentIndex={currentIndex}
          />
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
