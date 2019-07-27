import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// Assets
import AppIcon from '../assets/images/smiling-monkey-72-245713.png';

// MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextFeild from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux stuff
import {connect} from "react-redux";
import {loginUser} from "../redux/actions/userActions";

const styles = (theme) => ({
    form: {
        textAlign: 'center'
    },
    pageTitle: {
        margin: '20px auto 20px auto'
    },
    image: {
        margin: '10px auto 10px auto',
    },
    textField: {
        margin: '10px auto 10px auto',
    },
    button: {
        marginTop: 20,
        position: 'relative'
    },
    customError: {
        marginTop: 10,
        color: 'red',
        fontSize: '0.8rem'
    },
    progess: {
        position: 'absolute'
    }
});

class login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.UI.errors) {
            this.setState({errors: nextProps.UI.errors});
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        this.props.loginUser(userData, this.props.history);
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const {classes, UI: {loading}} = this.props;
        const {errors} = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm></Grid>
                <Grid item sm>
                    <img src={AppIcon} alt='Monkey' className={classes.image}/>
                    <Typography variant='h2' className={classes.pageTitle}>Login</Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextFeild
                            id='email'
                            name='email'
                            type='email'
                            label='Email'
                            className={classes.textField}
                            helperText={errors.email}
                            error={!!errors.email}
                            value={this.state.email}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextFeild
                            id='password'
                            name='password'
                            type='password'
                            label='Password'
                            className={classes.textField}
                            helperText={errors.password}
                            error={!!errors.password}
                            value={this.state.password}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        {errors.general && (
                            <Typography variant='body2' className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button
                            disabled={loading}
                            variant='contained'
                            color='primary'
                            type='submit'
                            className={classes.button}
                        >
                            Login
                            {loading && (
                                <CircularProgress size={30} className={classes.progess}/>
                            )}
                        </Button>
                        <br/>
                        <small>Don't have an account? Sign up <Link to='/signup'>here</Link>.</small>
                    </form>
                </Grid>
                <Grid item sm></Grid>
            </Grid>
        )
    }
}

login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
});

const mapActionsToProps = {
    loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login))
