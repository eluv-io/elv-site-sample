import React from "react";
import {render} from "react-dom";
import {inject, observer, Provider} from "mobx-react";
import {Redirect, Switch, withRouter} from "react-router";
import {HashRouter, Route} from "react-router-dom";
import * as Stores from "./stores";
import Site from "./components/Site";
import OverviewPage from "./components/overview/OverviewPage";
import VideoPage from "./components/video/ViewTitle";
import CodeAccess from "./components/navigation/CodeAccess";
import styled from "styled-components";
import "swiper/css/swiper.min.css";
import "./static/stylesheets/main.scss";


@inject("rootStore")
@inject("siteStore")
@observer
@withRouter
class Routes extends React.Component {
  componentDidUpdate(prevProps) {
    if(this.props.location.pathname !== prevProps.location.pathname) {
      this.props.rootStore.UpdateRoute(this.props.location.pathname);
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/code/:siteSelectorId" component={CodeAccess} />

        <Route
          exact
          path={[
            "/:siteId"
          ]}
          component={Site}
        />
        <Route exact path="/:siteId/overview/:titleID" component={OverviewPage} />
        <Route exact path="/:siteId/play/:titleID" component={VideoPage} />

        <Route>
          <Redirect to="/code/iq__YfEF1A8sUvMj5WcMCJEDk4aEwND" />
        </Route>
      </Switch>
    );
  }
}

// @inject("rootStore")
// @inject("siteStore")
// @observer
// @withRouter
// class Routes extends React.Component {
//   componentDidUpdate(prevProps) {
//     if(this.props.location.pathname !== prevProps.location.pathname) {
//       this.props.rootStore.UpdateRoute(this.props.location.pathname);
//     }
//   }

//   render() {
//     return (
//       <AsyncComponent
//         Load={
//           async () => {
//             await this.props.siteStore.LoadSite("iq__SufWAMfhP6P2tTUSrmdTjRdPfUM", "");
//           } 
//         }

//         render={() => {
//           if(!this.props.siteStore.client) { return null; }

//           return (
//             <Switch>
//               <Route
//                 exact
//                 path={[
//                   "/"
//                 ]}
//                 component={Site}
//               />
              
//               <Route exact path="/overview/:titleID" component={OverviewPage} />
//               <Route exact path="/code/:titleID" component={CodeAccess} />
//               <Route exact path="/title/:titleID" component={TitlePage} />

//               <Route>
//                 <Redirect to="/" />
//               </Route>
//               <Route>
//                 <Redirect to="/code/iq__YfEF1A8sUvMj5WcMCJEDk4aEwND" />
//               </Route>
//             </Switch>

//           );
//         }}
//       />
      
//     );
//   }
// }

@inject("rootStore")
@inject("siteStore")
@observer
class App extends React.Component {
  render() {
    const ContainerApp = styled.div`
      min-height: 100vh;    
      background: ${this.props.siteStore.backgroundColor};
      color: ${this.props.siteStore.primaryFontColor};
    }
    `;

    return (
      // <AsyncComponent
      //   Load={
      //     async () => {
      //       await this.props.rootStore.InitializeClient();
      //     } 
      //   }

      //   render={() => {
      //     if(!this.props.siteStore.client) { return null; }

      //     return (
      //       <ContainerApp>
      //         <main>
      //           {/* { this.props.rootStore.error ? <div className="error-message">{ this.props.rootStore.error }</div> : null } */}
      //           <HashRouter>
      //             <Routes />
      //           </HashRouter>
      //         </main>
      //       </ContainerApp>

      //     );
      //   }}
      // />
      <ContainerApp>
        <main>
          { this.props.rootStore.error ? <h3 className="error-message">{ this.props.rootStore.error }</h3> : null }
          <HashRouter>
            <Routes />
          </HashRouter>
        </main>
      </ContainerApp>
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
