import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

// Components
import MyButton from "../../util/MyButton";

// Icons
import FavouriteIcon from "@material-ui/icons/Favorite";
import FavouriteBorder from "@material-ui/icons/FavoriteBorder";

// Redux stuff
import {connect} from "react-redux";
import {likeScream, unlikeScream} from "../../redux/actions/dataActions";

class LikeButton extends Component {
    likedScream = () => {
        return !!(
            this.props.user.likes &&
            this.props.user.likes.find(
                like => like.screamId === this.props.screamId
            )
        );
    };
    likeScream = () => {
        this.props.likeScream(this.props.screamId);
    };
    unlikeScream = () => {
        this.props.unlikeScream(this.props.screamId);
    };

    render() {
        const {authenticated} = this.props.user;
        let likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton tip="Like">
                    <FavouriteBorder color="primary"/>
                </MyButton>
            </Link>
        ) : this.likedScream() ? (
            <MyButton tip="Like scream" onClick={this.unlikeScream}>
                <FavouriteIcon color="primary"/>
            </MyButton>
        ) : (
            <MyButton tip="Like scream" onClick={this.likeScream}>
                <FavouriteBorder color="primary"/>
            </MyButton>
        );
        return likeButton;
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
};

const mapActionsToProps = {
    likeScream,
    unlikeScream,
};

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);