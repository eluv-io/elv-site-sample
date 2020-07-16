import React from "react";
import {inject, observer} from "mobx-react";
import SwiperGrid from "./grid/SwiperGrid";
import ViewTitle from "./ViewTitle";
import Modal from "./modal/Modal";
import TitleGrid from "./grid/TitleGrid";
import {Redirect} from "react-router";
import AsyncComponent from "./AsyncComponent";
import MoviePremiere from "./premiere/MoviePremiere";
import HeroGrid from "./hero/HeroGrid";
import BoxFeature from "./hero/BoxFeature";
import VideoFeature from "./hero/VideoFeature";
import NavigationBar from "./NavigationBar";

const FormatName = (name) => {
  return (name || "")
    .split(/[_, \s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

@inject("rootStore")
@inject("siteStore")
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
      case "feature":
        switch (variant) {
          case "full_screen":
            return (
              <HeroGrid
                key={key}
                titles={titles}         
              />
            );
          case "box":
            return (
              <BoxFeature
                key={key}
                title={titles[0]}                   
                trailers={false} 
                shouldPlay={false} 
                isEpisode={false}
              />
            );
          case "video":
            return (
              <VideoFeature
                key={key} 
                title={titles[0]} 
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

  //USING THIS TO TEST DIFFERENT COMPONENTS
  TestContent() {
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
    let titles = this.props.siteStore.siteInfo.assets.titles;
    let moreTitles = titles.concat(this.props.siteStore.siteInfo.assets.titles);
    return (
      <React.Fragment>
        <HeroGrid titles={this.props.siteStore.siteInfo.playlists[1].titles.slice(0,1)}   />
        <SwiperGrid name="All Titles" titles={moreTitles}    trailers={false} shouldPlay={false} isEpisode={false} isPoster={false}/>
        <VideoFeature title={this.props.siteStore.siteInfo.assets.titles[1]}    trailers={false} shouldPlay={false} isEpisode={false} />
        <SwiperGrid name="Most Viewed" titles={this.props.siteStore.siteInfo.assets.titles}    trailers={false} shouldPlay={false} isEpisode={false} isPoster={true}/>
        <BoxFeature title={this.props.siteStore.siteInfo.assets.titles[4]}    trailers={false} shouldPlay={false} isEpisode={false} />
        { this.props.siteStore.siteInfo.playlists.map(playlist =>
          <SwiperGrid
            key={`title-reel-playlist-${playlist.playlistId}`}
            name={playlist.name}
            titles={playlist.titles}
            trailers={false}
            shouldPlay={false}
            isEpisode={false}
            isPoster={false}
          />
        )} 
        <BoxFeature title={this.props.siteStore.siteInfo.assets.titles[4]}    trailers={false} shouldPlay={false} isEpisode={false} />
        <VideoFeature title={this.props.siteStore.siteInfo.assets.titles[0]}    trailers={false} shouldPlay={false} isEpisode={false} />
        <SwiperGrid name="All Titles" titles={this.props.siteStore.siteInfo.assets.titles}    trailers={false} shouldPlay={false} isEpisode={false} isPoster={false}/>
        <TitleGrid name="All Titles" titles={this.props.siteStore.siteInfo.assets.titles}    trailers={false} shouldPlay={false} isEpisode={false} isPoster={true}/>
      </React.Fragment>
    );
  }

  ShowVideo() {
    return <ViewTitle key={`active-title-${this.props.siteStore.activeTitle.titleId}`} />;
  }

  ShowPremiere() {
    const siteCustomization = this.props.siteStore.siteCustomization || {};
    this.props.siteStore.SetBackgroundColor(siteCustomization.colors.background);
    this.props.siteStore.SetPrimaryFontColor(siteCustomization.colors.primary_text);

    return <MoviePremiere title={this.props.siteStore.premiere.title} />;
  }

  ShowModal() {
    return <Modal title={this.props.siteStore.modalTitle} />;
  }

  render() {
    if(this.props.match.params.siteSelectorId && !this.props.rootStore.accessCode) {
      return <Redirect to={`/code/${this.props.match.params.siteSelectorId}`} />;
    }

    return (
      <AsyncComponent
        Load={() => this.props.siteStore.LoadSite(this.props.match.params.siteId, this.props.match.params.writeToken)}
        render={() => {
          if(!this.props.siteStore.siteInfo) { return null; }

          return (
            <div className="container">
              { this.props.siteStore.activeTitle ? null : <NavigationBar />}
              { this.props.siteStore.activeTitle ? this.ShowVideo() : (this.props.siteStore.premiere ? this.ShowPremiere() : this.Content())}
              { this.props.siteStore.modalTitle ? this.ShowModal() : null }
           </div>
          );
        }}
      />
    );
  }
}
    
export default Site;
