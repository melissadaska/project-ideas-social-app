import { SET_PROJECTS, LOADING_DATA, LIKE_PROJECT, UNLIKE_PROJECT, DELETE_PROJECT } from '../types';
import axios from 'axios';

// get all projects
export const getProjects = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get('/projects')
        .then(response => {
            dispatch({
                type: SET_PROJECTS,
                payload: response.data
            })
        })
        .catch(err =>  {
            dispatch({
                type: SET_PROJECTS,
                payload: []
            })
        })
}

// like a project
export const likeProject = (projectId) => dispatch => {
    axios.get(`/projects/${projectId}/like`)
        .then(response => {
            dispatch({
                type: LIKE_PROJECT,
                payload: response.data
            })
        })
        .catch(err => console.log(err));
}

// unlike a project
export const unlikeProject = (projectId) => dispatch => {
    axios.get(`/projects/${projectId}/unlike`)
        .then(response => {
            dispatch({
                type: UNLIKE_PROJECT,
                payload: response.data
            })
        })
        .catch(err => console.log(err));
}

export const deleteProject = (projectId) => (dispatch) => {
    axios.delete(`/project/${projectId}`)
    .then(() => {
        dispatch({ type: DELETE_PROJECT, payload: projectId })
    })
    .catch(err=> console.log(err));
}
