import { SET_PROJECTS, SET_PROJECT, LIKE_PROJECT, UNLIKE_PROJECT, LOADING_DATA } from '../types';

const initialState = {
    projects: {},
    project: {},
    loading: false
};

export default function(state = initialState, action) {
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_PROJECTS:
            return {
                ...state,
                projects: action.payload,
                loading: false
            };
        case SET_PROJECT:
            return {
                ...state,
                project: action.payload
            };
        case LIKE_PROJECT:
        case UNLIKE_PROJECT:
            let index = state.project.findIndex(
                (project) => project.projectId === action.payload.projectId
            ); 
            state.projects[index] = action.payload;
            if (state.project.projectId === action.payload.projectId) {
                state.project = action.payload;
            }
            return {
                ...state
            };
        default: 
            return state;
    }
}
