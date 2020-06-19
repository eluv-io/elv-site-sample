import "../../static/stylesheets/original/app.scss";

import React from "react";
import {inject, observer} from "mobx-react";
import Path from "path";
import {ImageIcon, LoadingElement} from "elv-components-js";

import AsyncComponent from "../AsyncComponent";
import ActiveTitle from "./ActiveTitle";
import TitleReel from "./TitleReel";
import TitleGrid from "./TitleGrid";
import SearchBar from "../SearchBar";

import BackIcon from "../../static/icons/back.svg";
import CloseIcon from "../../static/icons/x.svg";
import {Redirect} from "react-router";

@inject("rootStore")
@inject("siteStore")
@observer
class Site extends React.Component {
  ActiveTitle() {
    return <ActiveTitle key={`active-title-${this.props.siteStore.activeTitle.titleId}`} />;
  }

  Content() {
    if(this.props.siteStore.searchQuery) {
      return (
        <LoadingElement loading={this.props.siteStore.searching} loadingClassname="loading-indicator">
          <TitleGrid
            noTitlesMessage="No results found"
            name="Search Results"
            titles={this.props.siteStore.searchResults}
          />
        </LoadingElement>
      );
    }

    return (
      <React.Fragment>
        { this.props.siteStore.siteInfo.playlists.map(playlist =>
          <TitleReel
            key={`title-reel-playlist-${playlist.playlistId}`}
            name={playlist.name}
            titles={playlist.titles}
          />
        )}

        <TitleReel name="Channels" titles={this.props.siteStore.siteInfo.assets.channels} />

        <TitleGrid name="Series" titles={this.props.siteStore.siteInfo.assets.series} />
        <TitleGrid name="Seasons" titles={this.props.siteStore.siteInfo.assets.seasons} />

        <TitleGrid name="Episodes" titles={this.props.siteStore.siteInfo.assets.episodes} />

        <TitleGrid name="All Titles" titles={this.props.siteStore.siteInfo.assets.titles} />
      </React.Fragment>
    );
  }

  BackButton() {
    let backAction, backText, backIcon;
    if(this.props.siteStore.activeTitle) {
      backIcon = CloseIcon;
      backText = "Back to Content";
      backAction = this.props.siteStore.ClearActiveTitle;
    } else if(this.props.siteStore.searchQuery) {
      backIcon = BackIcon;
      backText = "Back to All Content";
      backAction = this.props.siteStore.ClearSearch;
    } else {
      if(this.props.location.pathname.startsWith("/preview")) { return null; }

      backIcon = BackIcon;
      backText = "Back to Site Selection";
      backAction = () => {
        this.props.history.push(Path.dirname(this.props.location.pathname));
        this.props.siteStore.Reset();
      };
    }

    return (
      <ImageIcon
        key={`back-icon-${backText}`}
        className="back-button"
        title={backText}
        icon={backIcon}
        onClick={backAction}
      />
    );
  }

  render() {
    if(this.props.match.params.siteSelectorId && !this.props.rootStore.accessCode) {
      return <Redirect to={`/code/${this.props.match.params.siteSelectorId}`} />;
    }

    return (
      <AsyncComponent
        Load={() => this.props.siteStore.LoadSite(this.props.match.params.siteId, this.props.match.params.writeToken)}
        render={() => {
          const mainSiteName = this.props.siteStore.siteInfo.name;

          return (
            <div className="site" id="site">
              <h2 className="site-header" hidden={false}>
                {this.BackButton()}
                {mainSiteName}
                <SearchBar key={`search-bar-${this.props.siteStore.searchQuery}`}/>
              </h2>

              <LoadingElement loading={this.props.siteStore.loading}>
                {this.props.siteStore.activeTitle ? this.ActiveTitle() : this.Content()}
              </LoadingElement>
            </div>
          );
        }}
      />
    );
  }
}

export default Site;