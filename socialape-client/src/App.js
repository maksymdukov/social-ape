import React from "react";
import "./App.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import themeFile from "./util/theme";
import jwtDecode from "jwt-decode";
import axios from "axios";

//Redux
import {Provider} from "react-redux";
import store from "./redux/store";
import {SET_AUTHENTICATED} from "./redux/types";
import {getUserData, logoutUser} from "./redux/actions/userActions";

// MUI stuff
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Components
import Navbar from "./components/layout/Navbar";
import AuthRoute from "./util/AuthRoute";

// Pages
import home from "./pages/home";
import signup from "./pages/signup";
import login from "./pages/login";
import user from "./pages/user";

// dayjs
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);
const theme = createMuiTheme(themeFile);
axios.defaults.baseURL = `https://europe-west1-socialape-cec95.cloudfunctions.net/api`;

const token = localStorage.FBIdToken;
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logoutUser());
    } else {
        store.dispatch({type: SET_AUTHENTICATED});
        axios.defaults.headers.common["Authorization"] = token;
        store.dispatch(getUserData());
    }
}

function App() {
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <Router>
                        <Navbar/>
                        <div className="container">
                            <Switch>
                                <Route exact path="/" component={home}/>
                                <AuthRoute exact path="/login" component={login}/>
                                <AuthRoute exact path="/signup" component={signup}/>
                                <Route exact path="/users/:handle" component={user}/>
                                <Route exact path="/users/:handle/scream/:screamId" component={user}/>
                            </Switch>
                        </div>
                    </Router>
                </div>
            </MuiThemeProvider>
        </Provider>
    );
}

export default App;
