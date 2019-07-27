import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';
import {connect} from "react-redux";

const AuthRoute = ({component: Component, authenticated, ...rest}) => (
    <Route
        {...rest}
        render={(props) =>
            authenticated ? <Redirect to='/'/> : <Component {...props} />
        }
    />
);

AuthRoute.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps, null)(AuthRoute);