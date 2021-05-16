import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';

// MUI 
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/add';
import CloseIcon from '@material-ui/icons/close';

// Redux 
import { connect } from 'react-redux';
import { postProject, clearErrors } from '../redux/actions/dataActions';
import classes from '*.module.css';

const styles = {
    typography: {
        useNextVariants: true
    },
    form: {
        textAlign: 'center'
    },
    pageTitle: {
        margin: '10px auto 10px auto'
    },
    textField: {
        margin: '10px auto 10px auto'
      },
    Button: {
        marginTop: 20,
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    progress: {
        position: 'absolute'
    },
    card: {
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    },
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'
    }
}

class PostProject extends Component {
    state = {
        open: false,
        body: '',
        errors: {}
    };
    componentWillReceiveProps(nextProps) {
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            });
        };
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ body: '', open: false, errors: {} });
        }
    }
    handleOpen = () => {
        this.setState({ open: true })
    };
    handleClose = () => {
        this.props.clearErrors();
        this.setState({ open: false })
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postProject({ body: this.state.body });
    };
    render() {
        const { errors } = this.state;
        const { classses, UI: { loading }} = this.props;
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip='Post a Project!'>
                    <AddIcon/>
                </MyButton>
                <Dialog
                    open={this.state.open} onClose={this.handleClose} fullWidth maxWidth='sm'>
                        <MyButton tip='Close' onClick={this.handleClose} tipClassName={classes.closeButton}>
                            <CloseIcon/>
                        </MyButton>
                        <DialogTitle>Post a new project</DialogTitle>
                        <DialogContent>
                            <form onSubmit={this.handleSubmit}>
                                <TextField
                                    name="body"
                                    type='text'
                                    label='Project'
                                    multiline
                                    rows='3'
                                    placeholder='Project for your friends'
                                    error={errors.body ? true : false} 
                                        helperText={errors.body}
                                        className={classes.textField}
                                    onChange={this.handleChange}
                                    fullWidth
                                    />
                                <Button type='submit' variant='contained' color='primary'
                                className={classes.submitButton} disabled={loading}>
                                    Submit
                                    { loading && (
                                        <CircularProgress size={30} className={classes.progressSpinner}/>
                                    )}
                                   
                                </Button>
                            </form>
                        </DialogContent>
                </Dialog>
            </Fragment>

        )
    }
}

PostProject.propTypes = {
    postProject: propTypes.func.isRequred,
    clearErrors: propTypes.func.isRequred,
    UI: propTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    UI: state.UI
});

export default connect(
    mapStateToProps, 
    { postProject, clearErrors }
)(withStyles(styles)(PostProject));
