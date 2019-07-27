import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';

// Components
import EditDetails from './EditDetails';

// MUI stuff
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

// Icons
import LocationOn from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

// Redux stuff
import {connect} from "react-redux";
import {imageUpload, logoutUser} from "../../redux/actions/userActions";
import MyButton from "../../util/MyButton";
import ProfileSkeleton from "../../util/ProfileSkeleton";

const styles = (theme) => ({
    profile: theme.profile,
    paper: theme.paper,
    buttons: theme.buttons
});

class Profile extends Component {
    inputRef = React.createRef();

    handleImageChange = (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.imageUpload(formData);
    };

    handleEditImage = (e) => {
        this.inputRef.current.click();
    };

    handleLogout = () => {
        this.props.logoutUser();
    };

    render() {
        const {
            classes,
            user:
                {
                    credentials:
                        {
                            handle,
                            createdAt,
                            imageUrl,
                            bio,
                            website,
                            location
                        },
                    loading,
                    authenticated
                }
        } = this.props;
        let profileMarkup = !loading ?
            authenticated ? (
                    <Paper className={classes.paper}>
                        <div className={classes.profile}>
                            <div className="image-wrapper">
                                <img src={imageUrl} alt='profile' className='profile-image'/>
                                <input type='file' ref={this.inputRef} id='imageInput' hidden='hidden'
                                       onChange={this.handleImageChange}/>
                                <MyButton
                                    tip='Edit profile picture'
                                    onClick={this.handleEditImage}
                                    btnClassName='button'
                                >
                                    <EditIcon color='primary'/>
                                </MyButton>
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
                            <MyButton
                                tip='Logout'
                                onClick={this.handleLogout}
                            >
                                <KeyboardReturn color='primary'/>
                            </MyButton>
                            <EditDetails/>
                        </div>
                    </Paper>
                )
                : (<Paper className={classes.paper}>
                    <Typography variant='body2' align='center'>
                        No profile found, please login again
                    </Typography>
                    <div className={classes.buttons}>
                        <Button variant='contained' color='primary' component={Link} to='/login'>
                            Login
                        </Button>
                        <Button variant='contained' color='secondary' component={Link} to='/signup'>
                            Signup
                        </Button>
                    </div>
                </Paper>)
            : <ProfileSkeleton/>;

        return profileMarkup;
    }
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    imageUpload: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    imageUpload, logoutUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));