import {PropTypes} from "prop-types";
import React, {Component} from "react";

// Redux
import {connect} from "react-redux";
import {deleteScream} from "../../redux/actions/dataActions";
import MyButton from "../../util/MyButton";

// MUI stuff
import {withStyles, Dialog, Button} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

const styles = theme => ({
    deleteButton: {
        position: 'absolute',
        left: '90%',
        top: '10% '
    },
});

class DeleteScream extends Component {
    static propTypes = {
        deleteScream: PropTypes.func.isRequired,
        screamId: PropTypes.string.isRequired,
        classes: PropTypes.object.isRequired,
    };
    state = {
        open: false,
    };

    handleOpen = () => {
        this.setState({open: true});
    };
    handleClose = () => {
        this.setState({open: false});
    };
    deleteScream = () => {
        this.props.deleteScream(this.props.screamId);
        this.handleClose();
    };

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <MyButton
                    tip="Delete scream"
                    onClick={this.handleOpen}
                    btnClassName={classes.deleteButton}
                >
                    <DeleteOutline color='secondary'/>
                </MyButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Are you sure you want to delete this scream?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteScream} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default connect(null, {deleteScream})(
    withStyles(styles)(DeleteScream)
);
