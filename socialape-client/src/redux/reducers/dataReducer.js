import {
    DELETE_SCREAM,
    LIKE_SCREAM,
    LOADING_DATA, POST_SCREAM, SET_SCREAM,
    SET_SCREAMS, SUBMIT_COMMENT,
    UNLIKE_SCREAM
} from "../types";

const initialState = {
    screams: [],
    scream: {},
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true,
            };
        case SET_SCREAMS:
            return {
                ...state,
                screams: action.payload,
                loading: false
            };
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            let index = state.screams.findIndex(
                scream => scream.screamId === action.payload.screamId
            );
            let updScreams = [...state.screams];
            updScreams[index] = action.payload;
            if (state.scream.screamId === action.payload.screamId) {
                return {
                    ...state,
                    screams: updScreams,
                    scream: {...state.scream, likeCount: action.payload.likeCount}
                };
            }
            return {
                ...state,
                screams: updScreams
            };
        case DELETE_SCREAM:
            return {
                ...state,
                screams: state.screams.filter(
                    scream => scream.screamId !== action.payload
                )
            };
        case POST_SCREAM:
            return {
                ...state,
                screams: [action.payload, ...state.screams]
            };
        case SET_SCREAM:
            return {
                ...state,
                scream: action.payload
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                scream: {...state.scream, comments: [action.payload, ...state.scream.comments]}
            };
        default:
            return state;
    }
}
