import React, {Component} from "react";
import PropTypes from "prop-types";

// Redux stuff
import {connect} from "react-redux";

// MUI stuff
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from "../../util/MyButton";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Button from '@material-ui/core/Button';
import {Dialog} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {clearErrors, postScream} from "../../redux/actions/dataActions";

const styles = theme => ({
    textField: theme.textField,
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: theme.closeButton

});

export class PostScream extends Component {
    static propTypes = {
        postScream: PropTypes.func.isRequired,
        UI: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    state = {
        open: false,
        body: "",
    };

    handleOpen = () => {
        this.props.clearErrors();
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false, body: '', errors: {}});
    };

    handleChange = (ev) => {
        this.setState({[ev.target.name]: ev.target.value});
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        this.props.postScream({body: this.state.body});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.UI.loading && !this.props.UI.loading && !this.props.UI.errors) {
            this.handleClose();
        }
    }

    render() {
        const {
            classes,
            UI: {loading}
        } = this.props;
        const {errors} = this.props.UI;

        return (
            <React.Fragment>
                <MyButton tip="Post a scream" onClick={this.handleOpen}>
                    <AddIcon/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'
                >
                    <MyButton tip='Close' onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogTitle>
                        Post a new scream
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name='body'
                                type='text'
                                label='SCREAM'
                                multiline
                                fullWidth
                                rows={3}
                                placeholder={'Scream at your fellow apes'}
                                error={errors && !!errors.body}
                                helperText={errors && errors.body}
                                className={classes.textField}
                                onChange={this.handleChange}
                            />
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                className={classes.submitButton}
                                disabled={loading}
                            >
                                Submit
                                {loading && <CircularProgress size={30} className={classes.progressSpinner}/>}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    UI: state.UI
});


export default connect(
    mapStateToProps,
    {postScream, clearErrors}
)(withStyles(styles)(PostScream));
