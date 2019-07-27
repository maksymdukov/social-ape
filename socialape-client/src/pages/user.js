import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Redux
import {connect} from "react-redux";
import {getUserData} from "../redux/actions/dataActions";

// MUI stuff
import Grid from "@material-ui/core/Grid";

// Components
import Scream from "../components/scream/Scream";
import StatisProfile from "../components/profile/StatisProfile";
import ScreamSkeleton from "../util/ScreamSkeleton";
import ProfileSkeleton from "../util/ProfileSkeleton";

class User extends Component {
    state = {
        profile: null,
        screamIdParam: null,
    };

    clearScreamIdParam = () => {
        this.setState({screamIdParam: null});
    };

    componentDidMount() {
        const screamId = this.props.match.params.screamId;
        if (screamId) {
            this.setState({screamIdParam: screamId});
        }
        this.loadData();
    }

    loadData = () => {
        const handle = this.props.match.params.handle;
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({profile: res.data.user})
            })
            .catch(err => console.log(err))
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        const handle = this.props.match.params.handle;
        const prevHandle = prevProps.match.params.handle;
        if (prevHandle !== handle) {
            this.loadData();
        }
        const screamId = this.props.match.params.screamId;
        const prevScreamId = prevProps.match.params.screamId;
        if (screamId && screamId !== prevScreamId) {
            this.setState({screamIdParam: screamId});
        }
    }

    render() {
        const {screams, loading} = this.props.data;
        const {screamIdParam} = this.state;
        const screamsMarkup = loading
            ? <ScreamSkeleton/>
            : screams === null
                ? <p>No screams found for this user</p>
                : !screamIdParam
                    ? (
                        screams.map(scream => <Scream
                            key={scream.screamId}
                            scream={scream}
                            openDialog={false}
                            clearScreamIdParam={() => {
                            }}
                        />)
                    )
                    : (
                        screams.map(scream => <Scream
                            key={scream.screamId}
                            scream={scream}
                            openDialog={scream.screamId === screamIdParam}
                            clearScreamIdParam={this.clearScreamIdParam}
                        />)
                    );

        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item sm={8} xs={12}>
                        {screamsMarkup}
                    </Grid>
                    <Grid item sm={4} xs={12}>
                        {this.state.profile
                            ? <StatisProfile profile={this.state.profile}/>
                            : <ProfileSkeleton/>
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

User.propTypes = {
    data: PropTypes.object.isRequired,
    getUserData: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    data: state.data
});


export default connect(mapStateToProps, {getUserData})(User);