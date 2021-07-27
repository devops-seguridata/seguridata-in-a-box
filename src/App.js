import './App.css';
import LoginForm from './components/login_form_component';
import React, {useEffect, useState} from "react";
import {auth} from "./controller/firebase_controller";
import Home from "./components/home";

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
        return <div>Loading</div>;
    }
    return (
        <div className="App">
            {authentication.authenticated ? <Home/> : <LoginForm/>}
        </div>
    );
}

export default App;
