import './App.css';
import LoginForm from './components/Login/Login';
import React, {useEffect, useState} from "react";
import {auth} from "./controller/firebase_controller";
import Home from "./components/Home/Home";
import {BrowserRouter} from "react-router-dom";
import Waves from "./components/Waves/waves";

function App() {
    const [authentication, setAuthState] = useState({
        authenticated: false,
        initializing: true
    });

    useEffect(() =>
        auth.onAuthStateChanged(user => {
                if (user) {
                    setAuthState({
                        authenticated: true,
                        initializing: false
                    });
                } else {
                    setAuthState({
                        authenticated: false,
                        initializing: false
                    });
                }
            }
        ), [setAuthState]);

    if (authentication.initializing) {
        return <div>
            <Waves/>
        </div>;
    }
    return (
        <BrowserRouter>
            <div className="App">
                {authentication.authenticated ? <Home/> : <LoginForm/>}
            </div>
        </BrowserRouter>
    );
}

export default App;
