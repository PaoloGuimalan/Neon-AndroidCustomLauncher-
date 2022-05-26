import { SET_ASTRO, SET_WEATHER } from "../type/type";

export const setweatherdata = (state = {}, action) => {
    switch(action.type){
        case SET_WEATHER:
            return action.weatherdata;
        default:
            return state;
    }
}

export const setastrodata = (state = {}, action) => {
    switch(action.type){
        case SET_ASTRO:
            return action.astrodata;
        default:
            return state;
    }
}