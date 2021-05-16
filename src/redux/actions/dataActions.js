import { SET_PROJECTS, LOADING_DATA, LIKE_PROJECT, UNLIKE_PROJECT, DELETE_PROJECT, POST_PROJECT, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_PROJECT, STOP_LOADING_UI } from '../types';
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
};

// get a project
export const getProject = (projectId) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.get(`/project/${projectId}`)
        .then(response => {
            dispatch({
                type: SET_PROJECT,
                payload: response.data
            });
            dispatch({ type: STOP_LOADING_UI })
        })
        .catch(err => console.log(err));
};

// post a project
export const postProject = (newProject) => {
    dispatch({ type: LOADING_UI });
    axios.post('/project', newProject)
    .then(response => {
        dispatch({
            type: POST_PROJECT,
            payload: response.data
        });
        dispatch({ type: CLEAR_ERRORS });
    })
    .catch(err => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data
        })
    })
};

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
};

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
};

export const deleteProject = (projectId) => (dispatch) => {
    axios.delete(`/project/${projectId}`)
    .then(() => {
        dispatch({ type: DELETE_PROJECT, payload: projectId })
    })
    .catch(err=> console.log(err));
};

// clear errors
export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS })
};
