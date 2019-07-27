import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, {Component} from "react";

// Components
import DeleteScream from "./DeleteScream";
import LikeButton from "./LikeButton";

// Redux stuff
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import MyButton from "../../util/MyButton";

// MUI stuff
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import ScreamDialog from "./ScreamDialog";

const styles = {
    card: {
        display: "flex",
        marginBottom: 20,
        position: 'relative'
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: "cover",
    },
};

class Scream extends Component {

    render() {
        const {
            openDialog,
            classes,
            user: {authenticated, credentials: {handle}},
            scream: {
                userImage,
                body,
                createdAt,
                userHandle,
                screamId,
                likeCount,
                commentCount,
            },
        } = this.props;

        const deleteButton =
            authenticated && userHandle === handle ? (
                <DeleteScream screamId={screamId}/>
            ) : null;

        return (
            <Card className={classes.card}>
                <CardMedia
                    image={userImage}
                    title="Profile image"
                    className={classes.image}
                />
                <CardContent className={classes.content}>
                    <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${userHandle}`}
                        color="primary"
                    >
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton screamId={screamId}/>
                    <span>{likeCount} Likes</span>
                    <MyButton tip="Comments">
                        <ChatIcon color="primary"/>
                    </MyButton>
                    <span>{commentCount} comments</span>
                    <ScreamDialog
                        screamId={screamId}
                        userHandle={userHandle}
                        openDialog={openDialog}
                        clearScreamIdParam={this.props.clearScreamIdParam}
                    />
                </CardContent>
            </Card>
        );
    }
}

Scream.propTypes = {
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool,
    clearScreamIdParam: PropTypes.func
};

const mapStateToProps = state => ({
    user: state.user,
    data: state.data,
});


export default connect(mapStateToProps, null)(
    withStyles(styles)(Scream)
);
