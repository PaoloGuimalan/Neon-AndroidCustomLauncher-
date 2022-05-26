import { createStore, combineReducers } from "redux";
import { setastrodata, setweatherdata } from "../action/action";

const combiner = combineReducers({
    weatherdata: setweatherdata,
    astrodata: setastrodata
})

const store = createStore(combiner);

export default store;