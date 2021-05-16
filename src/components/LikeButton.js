import React, { Component } from 'react';
import MyButton from '../util/MyButton';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

// icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

// redux
import { connect } from 'react-redux';
import { likeProject, unlikeProject } from '../redux/actions/dataActions';

export class LikeButton extends Component {
    likedProject = () => {
        if (
            this.props.user.likes && this.props.user.likes.find(
                (like) => like.projectId === this.props.projectId
            )
        )
        return true;
        else return false;
    };
    likeProject = () => {
        this.props.likeProject(this.props.projectId);
    };
    unlikeProject = () => {
        this.props.unlikeProject(this.props.projectId);
    };
    render() {
        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <Link to = '/login'>
                <MyButton tip="Like">
                    <FavoriteBorder color="primary" />
                </MyButton>
            </Link>
        ) : this.likedProject() ? (
                <MyButton tip="Undo like" onClick={this.unlikeProject}>
                    <FavoriteIcon color="primary" />
                </MyButton>
        ) : (
            <MyButton tip="Undo like" onClick={this.likeProject}>
                <FavoriteBorder color="primary" />
            </MyButton>
        );
        return likeButton;
    }
};

LikeButton.propTypes = {
    user: propTypes.object.isRequired,
    projectId: propTypes.string.isRequired,
    likeProject: propTypes.func.isRequired,
    unlikeProject: propTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likeProject,
    unlikeProject
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
