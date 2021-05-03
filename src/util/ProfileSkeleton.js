import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import NoImg from '../images/no-img.png';

// MUI
import Paper from '@material-ui/core/Paper';

// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = {
  typography: {
      useNextVariants: true
  },
  form: {
      textAlign: 'center'
  },
  pageTitle: {
      margin: '10px auto 10px auto'
  },
  textField: {
      margin: '10px auto 10px auto'
  },
  Button: {
      marginTop: 20,
      position: 'relative'
  },
  customError: {
      color: 'red',
      fontSize: '0.8rem',
      marginTop: 10
  },
  progress: {
      position: 'absolute'
  },
  // handle: {
  //     height: 20,
  //     backgroundColor: palette.primary.main,
  //     width: 60,
  //     margin: '0 auto 7px auto'
  // },
  fullLine: {
      height: 15,
      backgroundColor: 'rgba(0,0,0,0.6)',
      width: '100%',
      marginBottom: 10
  },
    halfLine: {
      height: 15,
      backgroundColor: 'rgba(0,0,0,0.6)',
      width: '50%',
      marginBottom: 10
  },
  card: {
      display: 'flex',
      marginBottom: 20
  },
  image: {
      minWidth: 200
  },
  content: {
      padding: 25,
      objectFit: 'cover'
  }
};

const ProfileSkeleton = (props) => {
  const { classes } = props;
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={NoImg} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <div className={classes.handle} />
          <hr />
          <div className={classes.fullLine} />
          <div className={classes.fullLine} />
          <hr />
          <LocationOn color="primary" /> <span>Location</span>
          <hr />
          <LinkIcon color="primary" /> https://website.com
          <hr />
          <CalendarToday color="primary" /> Joined date
        </div>
      </div>
    </Paper>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSkeleton);
