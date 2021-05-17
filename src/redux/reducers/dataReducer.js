import { 
    SET_PROJECTS, 
    SET_PROJECT, 
    LIKE_PROJECT, 
    UNLIKE_PROJECT, 
    LOADING_DATA, 
    DELETE_PROJECT, 
    POST_PROJECT,
    SUBMIT_COMMENT 
} from '../types';

const initialState = {
    projects: [],
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
        case DELETE_PROJECT:
            index = state.project.findIndex(project => project.projectId === action.payload);
            state.projects.splice(index, 1);
            return {
                ...state
            };
        case POST_PROJECT: 
            return {
                ...state,
                projects: [action.payload, ...state.projects]
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                project: {
                    ...state.project,
                    comments: [action.payload, ...state.project.comments]
                }
            };
        default: 
            return state;
    }
}
