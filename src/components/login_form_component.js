import React, {useRef} from 'react';
import {auth} from "../controller/firebase_controller";

const LoginForm = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const signIn = e => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then(user => {
                console.log(user);
            }).catch(error => {
            console.log(error);
        });
    }

    return (
        <div>
            <form>
                <input ref={emailRef} type="email"/>
                <input ref={passwordRef} type="password"/>
                <button onClick={signIn}>Entrar</button>
            </form>
        </div>
    )

}

export default LoginForm