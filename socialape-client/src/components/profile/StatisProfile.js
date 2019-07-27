import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";


// Icons
import LocationOn from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link/Link";
import Typography from "@material-ui/core/Typography";

// Router
import {Link} from "react-router-dom";

const styles = (theme) => ({
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: '#00bcd4'
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
    },
});

const StatisProfile = (props) => {
    const {
        classes,
        profile:
            {
                handle,
                createdAt,
                imageUrl,
                bio,
                website,
                location
            }
    } = props;
    return (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={imageUrl} alt='profile' className='profile-image'/>
                </div>
                <hr/>
                <div className="profile-details">
                    <MuiLink
                        component={Link}
                        to={`/users/${handle}`}
                        color='primary'
                        variant='h5'
                    >
                        @{handle}
                    </MuiLink>
                    <hr/>
                    {bio && <Typography variant='body2'>{bio}</Typography>}
                    <hr/>
                    {location &&
                    <Fragment>
                        <LocationOn color='primary'/> <span>{location}</span>
                    </Fragment>
                    }
                    <hr/>
                    {website &&
                    <Fragment>
                        <LinkIcon color='primary'/>
                        <a href={website} target='_blank' rel='noopener noreferrer'>
                            {` `}{website}
                        </a>
                        <hr/>
                    </Fragment>
                    }
                    <CalendarToday color='primary'/>{` `}
                    <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                </div>
            </div>
        </Paper>
    );
};

StatisProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StatisProfile);