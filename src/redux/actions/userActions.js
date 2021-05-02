import axios from 'axios';
import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../types';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/login', userData)
    .then((response) => {
        const FBIdToken = `Bearer ${response.data.token}`;
        localStorage.setItem('FBIdToken', `Bearer ${response.data.token}`);
        axios.defaults.headers.common['Authorization'] = FBIdToken;
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        history.push('/');
    })
    .catch((err) => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data
        })
    });
}

export const getUserData = () => (dispatch) => {
    axios.get('/user')
        .then(response => {
            dispatch({
                type: SET_USER,
                payload: response.data
            })
        })
        .catch(err => console.log(err));
}
