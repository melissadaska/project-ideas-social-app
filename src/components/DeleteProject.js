import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import propTypes from 'prop-types';
import MyButton from '../util/MyButton';

// MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deleteProject } from '../redux/actions/dataActions';

const styles = {
    deleteButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
}

class DeleteProject extends Component {
    state = {
        open: false
    };
    handleOpen = () => {
        this.setState({ open: true });
    }
    handleClose= () => {
        this.setState({ open: false });
    }
    deleteProject = () => {
        this.props.deleteProject(this.props.projectId)
        this.setState({ open: false });
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip='Delete Project' 
                onClick={this.handleOpen}
                btnClassName={classes.deleteButton}>
                    <DeleteOutline color='secondary'/>
                </MyButton>  
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'>
                </Dialog>
                <DialogTitle>
                    Are you sure you want to delete this project?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={this.handleClose} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={this.deleteProject} color='secondary'>
                        Delete
                    </Button>
                </DialogActions>
            </Fragment>
        )
    }
}

DeleteProject.propTypes = {
    DELETE_PROJECT: propTypes.func.isRequired,
    classes: propTypes.object.isRequired,
    projectId: propTypes.string.isRequired
}

export default connect(null, { deleteProject })(withStyles(styles))(DeleteProject)
