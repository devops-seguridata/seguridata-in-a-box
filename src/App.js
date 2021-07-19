import './App.css';
import LoginForm from './components/login_form_component';
import {useEffect, useState} from "react";
import {auth} from "./controller/firebase_controller";
import Home from "./components/home";

function App() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged(userAuth => {
            if (userAuth) {
                setUser(userAuth)
            } else {
                setUser(null);
            }
        })
    })
    return (
        <div className="App">
            {user ? <Home/>:  <LoginForm/>}

        </div>
    );
}

export default App;
