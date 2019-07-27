import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {submitComment} from "../../redux/actions/dataActions";

// MUI stuff
import Button from '@material-ui/core/Button';
import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";


const styles = (theme) => ({
    visibleSeparator: theme.visibleSeparator,
    textField: theme.textField
})

class CommentForm extends Component {
    state = {body: ''};

    handleChange = (ev) => {
        this.setState({[ev.target.name]: ev.target.value});
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        this.props.submitComment(this.props.screamId, {body: this.state.body})
            .then(() => this.setState({body: ''}))
    };


    render() {
        const {classes, authenticated, UI: {errors}} = this.props;
        const commentFormMarkup = authenticated
            ? (
                <Grid item sm={12} style={{textAlign: "center"}}>
                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            name='body'
                            type='text'
                            label='Comment on scream'
                            error={errors && !!errors.comment}
                            helperText={errors && errors.comment}
                            value={this.state.body}
                            onChange={this.handleChange}
                            fullWidth
                            className={classes.textField}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            className={classes.button}
                        >
                            Submit
                        </Button>
                    </form>
                    <hr className={classes.visibleSeparator}/>
                </Grid>
            )
            : null;
        return commentFormMarkup;
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired,
    screamId: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,

};

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated
});


const mapActionsToProps = {submitComment};


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CommentForm));