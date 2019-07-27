import React from 'react';
import PropTypes from 'prop-types';
import noImg from '../assets/images/no-avatar.png';

// MUI
import withStyles from "@material-ui/core/styles/withStyles";

// Icons
import LocationOn from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import {Paper} from "@material-ui/core";

const styles = (theme) => ({
    paper: theme.paper,
    profile: theme.profile,
    handle: {
        height: 20,
        backgroundColor: theme.palette.primary.main,
        width: 60,
        margin: '0 auto 7px auto'
    },
    fullLine: {
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: '100%',
        marginBottom: 10,
    },
    halfLine: {
        height: 15,
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: '50%',
        marginBottom: 10,
    }
});

const ProfileSkeleton = (props) => {
    const {classes} = props;
    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className='image-wrapper'>
                    <img src={noImg} alt='Profile' className='profile-image'/>
                    <hr/>
                    <div className='profile-detail'>
                        <div className={classes.handle}></div>
                        <hr/>
                        <div className={classes.fullLine}></div>
                        <div className={classes.fullLine}></div>
                        <hr/>
                        <LocationOn color='primary'/> <span>Location</span>
                        <hr/>
                        <LinkIcon color='primary'/> https://website.com
                        <hr/>
                        <CalendarToday color='primary'/> Joined date
                    </div>
                </div>
            </div>
        </Paper>
    );
}

ProfileSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfileSkeleton);