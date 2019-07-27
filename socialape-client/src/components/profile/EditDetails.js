import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

// MUI stuff
import {withStyles} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

// Icons
import EditIcon from '@material-ui/icons/Edit';

// Redux
import {connect} from "react-redux";
import {editUserDetails} from "../../redux/actions/userActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import MyButton from "../../util/MyButton";

const styles = (theme) => ({
    textField: theme.textField,
    button: {
        float: 'right'
    }
});


class EditDetails extends Component {
    state = {
        bio: '',
        website: '',
        location: '',
        open: false
    };

    handleOpen = () => {
        const {credentials} = this.props;
        this.setState({open: true});
        this.mapUserDetailsToState(credentials);
    };

    handleClose = () => {
        this.setState({open: false});
    };

    mapUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio || '',
            website: credentials.website || '',
            location: credentials.location || '',
        })
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    };

    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <MyButton
                    tip='Edit details'
                    btnClassName={classes.button}
                    onClick={this.handleOpen}
                >
                    <EditIcon color='primary'/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'
                >
                    <DialogTitle>
                        Edit your details
                    </DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name='bio'
                                type='text'
                                label='Bio'
                                multiline
                                rows='3'
                                placeholder='A short bio about yourself'
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name='website'
                                type='text'
                                label='Website'
                                placeholder='Your personal/professional website'
                                className={classes.textField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name='location'
                                type='text'
                                label='Location'
                                placeholder='Where you live'
                                className={classes.textField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='primary'>
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color='primary'>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,

};

const mapStateToProps = (state) => ({
    credentials: state.user.credentials
});

export default connect(mapStateToProps, {editUserDetails})(withStyles(styles)(EditDetails));