import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';

//Redux
import { connect } from 'react-redux';
import { getProject, clearErrors } from '../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.spreadThis,
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
        marginBottom: 50
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
        this.props.clearErrors();
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
                userHandle,
                comments
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
                    <LikeButton projectId={projectId} />
                    <span>{likeCount} likes</span>
                    <MyButton tip = "comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} comments</span>
                </Grid>
                <hr className={classes.visibleSeperator} />
                <CommentForm projectId={projectId} />
                <Comments comments={comments} />
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
    clearErrors: PropTypes.func.isRequired,
    getProject: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.data.project,
    UI: state.UI
})

const mapActionsToProps = {
    getProject,
    clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ProjectDialog));
