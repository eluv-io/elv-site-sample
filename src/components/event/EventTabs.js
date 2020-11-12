import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ScheduleIcon from '@material-ui/icons/Schedule';
import InfoIcon from '@material-ui/icons/Info';

import Paper from '@material-ui/core/Paper';

// import LiveChat from "./LiveChat";
// import FanWall from './FanWall';
import FilmOverview from "./FilmOverview";
import Merch from "./Merch";
import Schedule from "./series/SeriesSchedule";
import ConcertSchedule from "./concert/ConcertSchedule";
import ConcertOverview from "./concert/ConcertOverview";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="stream-container__tabs--bottom"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 5000,
    backgroundColor: "transparent",
  },
  indicator: {
    backgroundColor: 'white',
    color: 'white',
  },
});



class EventTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
    };
  }

  ScheduleManager(type) {

    if (type == "series") {
      return (
        <TabPanel value={this.state.tab} index={1}>
          <Schedule name={this.props.name} />
        </TabPanel>
      )
    } else if (type == "concert") {
      return (
        <TabPanel value={this.state.tab} index={1}>
          <ConcertSchedule name={this.props.name} />
        </TabPanel>
    
      )
    } else {
      return null;
    }
  }
  
  render() {
    // const classes = useStyles();
    // const [value, setValue] = React.useState(0);
    const { classes } = this.props;

    const handleChange = (event, newValue) => {
      this.setState({tab: newValue});
    };
    let showSchedule = 1;
    if (this.props.type != "film") {
      showSchedule = 2; 
    }


    return (
      <div className="premiereTabs">
        <Paper square className={classes.root}>
          <Tabs
            value={this.state.tab}
            onChange={handleChange}
            variant="fullWidth"
            disablefocusripple = "true"
            disableripple = "true"
            classes={{
              indicator: classes.indicator
            }}
          >
            <Tab icon={<InfoIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>OVERVIEW</span>} />
            {this.props.type != "film" ? <Tab icon={<ScheduleIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>{this.props.type == "series" ? "EPISODE SCHEDULE" : "UPCOMING SHOWS"}</span>} /> : null}
            <Tab icon={<ShoppingCartIcon style={{ color: "white",fontSize: 22  }} />} label={<span style={{ color: 'white', fontSize: 12, marginBottom: 5 }}>MERCH</span>} />

          </Tabs>
          
          <TabPanel value={this.state.tab} index={0}>
            {this.props.type == "concert" ?  <ConcertOverview title={this.props.title} name={this.props.name}/>  :  <FilmOverview title={this.props.title} name={this.props.name}/> }
          </TabPanel>
          {this.ScheduleManager(this.props.type)}
          <TabPanel value={this.state.tab} index={showSchedule}>
            <Merch name={this.props.name}/>
          </TabPanel>
          
        </Paper>
      </div>
    );
        }
}
EventTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventTabs);