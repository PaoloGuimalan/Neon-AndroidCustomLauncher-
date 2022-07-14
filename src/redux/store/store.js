import { createStore, combineReducers } from "redux";
import { setapplist, setastrodata, setweatherdata } from "../action/action";

const combiner = combineReducers({
    weatherdata: setweatherdata,
    astrodata: setastrodata,
    applist: setapplist
})

const store = createStore(combiner);

export default store;