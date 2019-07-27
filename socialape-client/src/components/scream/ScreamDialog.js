import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Components
import MyButton from "../../util/MyButton";
import LikeButton from "./LikeButton";

// Third-party
import dayjs from 'dayjs';

// Redux
import {connect} from "react-redux";
import {clearErrors, getScream} from "../../redux/actions/dataActions";

// Router
import {Link} from "react-router-dom";

// MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import DialogContent from "@material-ui/core/DialogContent";
import {Dialog} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import CloseIcon from "@material-ui/icons/Close";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

const styles = (theme) => ({
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    invisibleSeparator: theme.invisibleSeparator,
    visibleSeparator: theme.visibleSeparator,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
});

class ScreamDialog extends Component {
    state = {
        open: false,
        oldPath: ''
    };

    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.openDialog && this.props.openDialog !== prevProps.openDialog) {
            this.handleOpen();
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname;
        const {userHandle, screamId} = this.props;
        const newPath = `/users/${userHandle}/scream/${screamId}`;
        if (oldPath === newPath) {
            oldPath = `/users/${userHandle}`;
        }
        window.history.pushState(null, null, newPath);
        this.setState({open: true, oldPath: oldPath});
        this.props.getScream(this.props.screamId);
    };
    handleClose = () => {
        if (this.state.oldPath) {
            window.history.pushState(null, null, this.state.oldPath);
        }
        this.setState({open: false});
        this.props.clearErrors();
        this.props.clearScreamIdParam();
    };

    render() {
        const {
            classes,
            scream:
                {
                    screamId,
                    body,
                    createdAt,
                    likeCount,
                    commentCount,
                    userImage,
                    userHandle,
                    comments
                },
            UI: {loading}
        } = this.props;
        const dialogMarkup = loading
            ? (<div className={classes.spinnerDiv}>
                    <CircularProgress size={100} thickness={2}/>
                </div>
            )
            : (
                <Grid
                    container
                    spacing={2}
                >
                    <Grid item sm={5}>
                        <img src={userImage} alt='Profile' className={classes.profileImage}/>
                    </Grid>
                    <Grid item sm={7}>
                        <Typography
                            component={Link}
                            color='primary'
                            variant='h5'
                            to={`/users/${userHandle}`}
                        >
                            @{userHandle}
                        </Typography>
                        <hr className={classes.invisibleSeparator}/>
                        <Typography variant='body2' color='textSecondary'>
                            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                        </Typography>
                        <hr className={classes.invisibleSeparator}/>
                        <Typography variant='body1'>
                            {body}
                        </Typography>
                        <LikeButton screamId={screamId}/>
                        <span>{likeCount} likes</span>
                        <MyButton tip="Comments">
                            <ChatIcon color="primary"/>
                        </MyButton>
                        <span>{commentCount} comments</span>
                    </Grid>
                    <hr className={classes.visibleSeparator}/>
                    <CommentForm screamId={screamId}/>
                    <Comments comments={comments}/>
                </Grid>
            )
        return (
            <React.Fragment>
                <MyButton
                    onClick={this.handleOpen}
                    tip='Expand the scream'
                    tipClassName={classes.expandButton}
                >
                    <UnfoldMore color='primary'/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'
                >
                    <MyButton
                        tip='Close'
                        onClick={this.handleClose}
                        tipClassName={classes.closeButton}
                    >
                        <CloseIcon/>
                    </MyButton>
                    <DialogContent className={classes.DialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

ScreamDialog.propTypes = {
    getScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    openDialog: PropTypes.bool,
    clearScreamIdParam: PropTypes.func
};

ScreamDialog.defaultProps = {
    clearScreamIdParam: () => {
    },
    openDialog: false
};

const mapStateToProps = (state) => ({
    scream: state.data.scream,
    UI: state.UI
});
export default connect(mapStateToProps, {getScream, clearErrors})(
    withStyles(styles)(ScreamDialog)
);