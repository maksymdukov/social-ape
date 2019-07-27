import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import PostScream from "../scream/PostScream";

// MUI stuff
import Appbar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

// Redux
import {connect} from "react-redux";
import MyButton from "../../util/MyButton";

// Icons
import HomeIcon from "@material-ui/icons/Home";

// Components
import Notifications from "./Notifications";

class Navbar extends Component {
    render() {
        const {authenticated} = this.props;
        return (
            <Appbar>
                <Toolbar className="nav-container">
                    {authenticated ? (
                        <React.Fragment>
                            <PostScream/>
                            <Link to="/">
                                <MyButton tip="Home">
                                    <HomeIcon/>
                                </MyButton>
                            </Link>
                            <Notifications/>
                        </React.Fragment>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/">
                                Home
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                Signup
                            </Button>
                        </>
                    )}
                </Toolbar>
            </Appbar>
        );
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    authenticated: state.user.authenticated
});

export default connect(
    mapStateToProps,
    null
)(Navbar);
