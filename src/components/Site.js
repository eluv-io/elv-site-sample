import React from "react";
import {inject, observer} from "mobx-react";
import {withRouter,Redirect} from "react-router";

import SwiperGrid from "./grid/SwiperGrid";
import TitleGrid from "./grid/TitleGrid";
import HeroGrid from "./hero/HeroGrid";
import BoxFeature from "./hero/BoxFeature";
import NewVideoFeature from "./hero/VideoFeature";
import NavigationBar from "./navigation/NavigationBar";
import AsyncComponent from "./navigation/AsyncComponent";

const FormatName = (name) => {
  return (name || "")
    .split(/[_, \s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

@inject("rootStore")
@inject("siteStore")
@withRouter
@observer
class Site extends React.Component {
  ArrangementEntry(entry, i) {
    const key = `arrangement-entry-${i}`;

    let name, titles;
    switch (entry.type) {
      case "header":
        return <h1 key={key}>{entry.options.text}</h1>;
      case "playlist":
        const playlist = this.props.siteStore.siteInfo.playlists.find(playlist => playlist.slug === entry.playlist_slug);
        name = entry.label;
        titles = playlist.titles;
        break;
      case "asset":
        name = entry.label;
        titles = this.props.siteStore.siteInfo.assets[entry.name];
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown Asset Type:", entry.type);
        // eslint-disable-next-line no-console
        console.error(entry);
        return;
    }


    const variant = entry.options && entry.options.variant;
    switch (entry.component) {
      case "hero":
        return (
          <HeroGrid
            key={key}
            titles={titles}
          />
        );
      case "feature":
        switch (variant) {
          case "box":
            return (
              <BoxFeature
                key={key}
                title={entry.title}
                trailers={false}
                shouldPlay={false}
                isEpisode={false}
                backgroundColor={entry.options.color}
              />
            );
          case "video":
            return (
              <NewVideoFeature
                key={key}
                title={entry.title}
                trailers={false}
                shouldPlay={false}
                isEpisode={false}
              />
            );
          default:
            // eslint-disable-next-line no-console
            console.error("Unknown variant:", variant);
            // eslint-disable-next-line no-console
            console.error(entry);
            return;
        }

      case "carousel":
        return (
          <SwiperGrid
            key={key}
            name={name}
            titles={titles}
            trailers={false}
            shouldPlay={false}
            isEpisode={false}
            isPoster={variant === "portrait"}
          />
        );

      case "grid":
        return (
          <TitleGrid
            key={key}
            name={name}
            titles={titles}
            trailers={false}
            shouldPlay={false}
            isEpisode={false}
            isPoster={variant === "portrait"}
          />
        );
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown component:", entry.component);
        // eslint-disable-next-line no-console
        console.error(entry);
    }
  }

  Content() {
    if(this.props.siteStore.searchQuery) {
      return (
        <TitleGrid
          noTitlesMessage="No results found"
          name="Search Results"
          titles={this.props.siteStore.searchResults}
          trailers={false}
          shouldPlay={false}
          isEpisode={false}
        />
      );
    }


    const siteCustomization = this.props.siteStore.siteCustomization || {};
    let arrangement = siteCustomization.arrangement;
    this.props.siteStore.SetBackgroundColor(siteCustomization.colors.background);
    this.props.siteStore.SetPrimaryFontColor(siteCustomization.colors.primary_text);

    if(!arrangement) {
      // Default arrangement: Playlists then assets, all medium carousel
      arrangement = this.props.siteStore.siteInfo.playlists.map(playlist => ({
        type: "playlist",
        name: playlist.name,
        label: playlist.name,
        playlist_slug: playlist.slug,
        component: "carousel",
        options: {
          variant: "landscape",
          width: "medium"
        }
      }));

      arrangement = arrangement.concat(
        Object.keys(this.props.siteStore.siteInfo.assets).sort().map(key => ({
          type: "asset",
          name: key,
          label: FormatName(key),
          component: "carousel",
          options: {
            variant: "landscape",
            width: "medium"
          }
        }))
      );
    }

    return arrangement.map((entry, i) => this.ArrangementEntry(entry, i));
  }

  render() {
    if(!this.props.rootStore.client || (!this.props.rootStore.accessCode)) {
      return <Redirect to={`/code/iq__YfEF1A8sUvMj5WcMCJEDk4aEwND`} />;
    }
    // if(!this.props.rootStore.client || !this.props.siteStore.siteInfo) {
    //   return null;
    // }

    return (
      <AsyncComponent
        Load={async () => await this.props.siteStore.LoadSite(this.props.match.params.siteId, this.props.match.params.writeToken)}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="container">
              <NavigationBar />
              { this.Content() }
              <div className="live-footer">
                <h3 className="live-footer__title">
                  Copyright © Eluvio 2020 
                </h3>
              </div>
            </div>
          );
        }}
      />
      
    );
  }
}

export default Site;
