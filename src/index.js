import "./static/stylesheets/app.scss";
// import "dotenv/config";
import BackIcon from "./static/icons/back.svg";
import CloseIcon from "./static/icons/x.svg";

import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";

import {ImageIcon, LoadingElement} from "elv-components-js";

import * as Stores from "./stores";

import Logo from "./static/images/Logo.png";
import GithubIcon from "./static/icons/github.svg";
import Site from "./components/Site";
import ContentSelector from "./components/ContentSelector";
import CodeAccess from "./components/CodeAccess";

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  SourceLink() {
    const sourceUrl = "https://github.com/eluv-io/elv-site-sample";
    return (
      <a className="source-link" href={sourceUrl} target="_blank">
        <ImageIcon className="github-icon" icon={GithubIcon} />
        Source available on GitHub
      </a>
    );
  }

  Localization() {
    if(this.props.siteStore.sites.length !== 1) {
      return null;
    }

    let languages, territories;
    if(Object.keys(this.props.siteStore.localization.territories).length > 0) {
      territories = (
        <select value={this.props.siteStore.territory} onChange={async event => await this.props.siteStore.SetTerritory(event.target.value)}>
          {
            Object.keys(this.props.siteStore.localization.territories).sort().map(territory =>
              <option key={`territory-${territory}`} value={territory}>{ territory }</option>
            )
          }
        </select>
      );
    }

    const availableLanguages = this.props.siteStore.localization.territories[this.props.siteStore.territory] || this.props.siteStore.localization.languages;
    if(availableLanguages.length > 0) {
      languages = (
        <select value={this.props.siteStore.language} onChange={async event => await this.props.siteStore.SetLanguage(event.target.value)}>
          {
            availableLanguages.sort().map(language =>
              <option key={`language-${language}`} value={language}>{ language }</option>
            )
          }
        </select>
      );
    }

    if(!territories && !languages) {
      return null;
    }

    return (
      <div className="localization">
        { territories }
        { languages }
      </div>
    );
  }

  App() {
    if(!this.props.rootStore.client) {
      return <LoadingElement loading={true} fullPage={true}/>;
    }

    if(this.props.siteStore.currentSite) {
      return <Site key={`site-${this.props.siteStore.siteId}-${this.props.siteStore.territory}-${this.props.siteStore.language}`} />;
    } else if(this.props.rootStore.siteSelector) {
      return (
        <CodeAccess />
      );
    } else {
      return (
        <LoadingElement loading={this.props.siteStore.loading}>
          <ContentSelector />
        </LoadingElement>
      );
    }
  }

  SiteHeader() {
    if(this.props.siteStore.currentSite) {
      return <h2>{ this.props.siteStore.currentSite.name }</h2>;
    } else {
      return <h2>Site Sample</h2>;
    }
  }

  render() {

    return (
      <div className="app-container">
        <header>
          <ImageIcon className="logo" icon={Logo} label="Eluvio" onClick={this.props.rootStore.ReturnToApps}/>
          { this.Localization() }
          { this.SiteHeader() }
          { this.SourceLink() }
        </header>
        <main>
          { this.props.rootStore.error ? <h3 className="error-message">{ this.props.rootStore.error }</h3> : null }
          { this.App() }
        </main>
      </div>
    );
  }
}

render(
  (
    <React.Fragment>
      <Provider {...Stores}>
        <App />
      </Provider>
      <div className="app-version">{EluvioConfiguration.version}</div>
    </React.Fragment>
  ),
  document.getElementById("app")
);
