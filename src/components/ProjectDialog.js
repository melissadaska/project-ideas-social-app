import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/Typography';

//Icons
import CloseIcon from '@material-ui/icons/close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';

//Redux
import { connect } from 'react-redux';
import { getProject } from '../redux/actions/dataActions';

const styles = ({
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
    invisibleSeperator: {
        border: 'none',
        maring: 4
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        margionBottom: 50
    }
});

class ProjectDialog extends Component {
    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({ open: true });
        this.props.getProject(this.props.projectId)
    };
    handleClose = () => {
        this.setState({ open: false });
    }; 
    render() {
        const { 
            classes, 
            project: {
                projectId, 
                body, 
                createdAt, 
                likeCount, 
                commentCount, 
                userImage, 
                userHandle
            }, UI: {loading} 
        } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2} />
            </div>
        ) : (
            <Grid container spacing={16}>
                <Grid item sm={5}>
                    <img src={userImage} alt='Profile' className={classes.profileImage} />
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color='primary'
                        variant='h5'
                        to={`/users/${userHandle}`}
                    >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeperator} />
                    <Typography variant='body2' color='textSecondary'>
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeperator} />
                    <Typography variant='body1'>
                        {body}
                    </Typography>
                </Grid>
            </Grid>
        )

        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip='Expand project' tipClassName={classes.expandButton}>
                    <UnfoldMore color='primary'/>
                </MyButton>
                <Dialog
                open={this.state.open} 
                onClose={this.handleClose} 
                fullWidth 
                maxWidth='sm'
                >
                <MyButton 
                    tip='Close' 
                    onClick={this.handleClose} 
                    tipClassName={classes.closeButton}
                >
                    <CloseIcon/>
                </MyButton>
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

ProjectDialog.propTypes = {
    getProject: propTypes.func.isRequired,
    projectId: propTypes.string.isRequired,
    userHandle: propTypes.string.isRequired,
    project: propTypes.object.isRequired,
    UI: propTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.data.project,
    UI: state.UI
})

const mapActionsToProps = {
    getProject
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ProjectDialog));
