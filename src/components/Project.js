import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import propTypes from 'prop-types';
import MyButton from '../util/MyButton';
import DeleteProject from './DeleteProject';
import ProjectDialog from './ProjectDialog.js';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import { connect } from 'react-redux';
import { likeProject, unlikeProject } from '../redux/dataActions';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

export class Project extends Component {
    likedProject = () => {
        if (
            this.props.user.likes && this.props.user.likes.find(
                (like) => like.projectId === this.props.project.projectId
            )
        )
        return true;
        else return false;
    };
    likeProject = () => {
        this.props.likeProject(this.props.project.projectId);
    }
    unlikeProject = () => {
        this.props.unlikeProject(this.props.project.projectId);
    }
    render() {
        dayjs.extend(relativeTime)
        const { 
            classes, 
            project: { 
                body, 
                createdAt, 
                userImage, 
                userHandle, 
                projectId, 
                likeCount, 
                commentCount 
            },
            user: 
                { authenticated, credentials: { handle } }
        } = this.props;
        const likeButton = !authentiated ? (
            <MyButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary" />
                </Link>
            </MyButton>
        ) : 
            this.likedProject() ? (
                <MyButton tip="Undo like" onClick={this.unlikeProject}>
                    <FavoriteIcon color="primary" />
                </MyButton>
        ) : (
            <MyButton tip="Undo like" onClick={this.likeProject}>
                <FavoriteBorder color="primary" />
            </MyButton>
        );
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteProject projectId={projectId}/>
        ) : null
        return (
            <Card className={classes.card}>
                <CardMedia 
                image = {userImage} 
                title="Profile image" className={classes.image}/>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary" >
                        {userHandle} 
                    </Typography>
                    <DeleteProject />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    { likeButton }
                    <span>
                        {likeCount} Likes 
                    </span>
                    <MyButton tip = "comments">
                        <ChatIcon color="primary" />
                    </MyButton>
                    <span>{commentCount} Comments</span>
                    <ProjectDialog projectId={projectId} userHandle={userHandle} />
                </CardContent>
            </Card>
        )
    }
}

Project.propTypes = {
    likeProject: propTypes.func.isRequired,
    unlikeProject: propTypes.func.isRequired,
    user: propTypes.func.isRequired,
    project: propTypes.func.isRequired,
    classes: propTypes.func.isRequired,
}

const mapStateToProps = state => ({
    user: state.user
})

const mapActionsToProps = {
    likeProject,
    unlikeProject
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Project));
