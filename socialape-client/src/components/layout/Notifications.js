import React, {Component} from 'react';
import PropTypes from 'prop-types';
import dayjs from "dayjs";

// MUI Stuff
import {Badge} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from '@material-ui/core/IconButton';
import Menu from "@material-ui/core/Menu";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from "@material-ui/core/Typography";

// Icons
import NotificationIcon from "@material-ui/icons/Notifications";
import FavouriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import {connect} from "react-redux";
import {markNotificationsRead} from "../../redux/actions/userActions";

// Router
import {Link} from 'react-router-dom';

class Notifications extends Component {
    state = {
        anchorEl: null
    };

    handleOpen = (event) => {
        this.setState({anchorEl: event.target});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };
    onMenuOpened = () => {
        const unreadNotificationIds = this.props.notifications
            .filter(not => !not.read)
            .map(not => not.notificationId);
        this.props.markNotificationsRead(unreadNotificationIds);
    };

    render() {
        const {notifications} = this.props;
        const anchorEl = this.state.anchorEl;

        let notificationIcon;
        if (notifications && notifications.length) {
            const number = notifications.filter(not => not.read === false).length;
            number > 0
                ? (notificationIcon = (
                    <Badge
                        badgeContent={number}
                        color='secondary'
                    >
                        <NotificationIcon/>
                    </Badge>
                ))
                : notificationIcon = (
                    <NotificationIcon/>
                )
        } else {
            notificationIcon = <NotificationIcon/>;
        }
        let notificationsMarkup = notifications && notifications.length
            ? (
                notifications.map(not => {
                    const verb = not.type === 'like' ? 'liked' : 'commented on';
                    const time = dayjs(not.createdAt).fromNow();
                    const iconColor = not.read ? 'primary' : 'secondary';
                    const icon = not.type === 'like'
                        ? (<FavouriteIcon color={iconColor} style={{marginRight: 10}}/>)
                        : (<ChatIcon color={iconColor} style={{marginRight: 10}}/>);
                    return (
                        <Link
                            to={`/users/${not.recipient}/scream/${not.screamId}`}
                            key={not.createdAt}
                        >
                            <MenuItem onClick={this.handleClose}>
                                {icon}
                                <Typography
                                    variant='body1'
                                    color='textPrimary'
                                >
                                    {not.sender} {verb} your scream {time}
                                </Typography>
                            </MenuItem>
                        </Link>
                    )
                })
            )
            : (
                <MenuItem onClick={this.handleClose}>
                    You have no notifications yet...
                </MenuItem>
            )
        return (
            <React.Fragment>
                <Tooltip title='Notifications' placement='top'>
                    <IconButton
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup={true}
                        onClick={this.handleOpen}
                    >
                        {notificationIcon}
                    </IconButton>
                </Tooltip>
                <Menu
                    id='simple-menu'
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    onEntered={this.onMenuOpened}
                >
                    {notificationsMarkup}
                </Menu>
            </React.Fragment>
        );
    }
}

Notifications.propTypes = {
    notifications: PropTypes.array.isRequired,
    markNotificationsRead: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    notifications: state.user.notifications
});

const mapActionsToProps = {
    markNotificationsRead
};

export default connect(mapStateToProps, mapActionsToProps)(Notifications);