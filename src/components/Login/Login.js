import React, {useRef} from 'react';
import {auth} from "../../controller/firebase_controller";
import logo from '../../assets/logo.png'
import {Link} from "react-router-dom";
import { ToastContainer} from "react-toastify";
import Waves from "../Waves/waves";
import './login.css'

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
    <div className="center">

        <header>
            <Link to="./login">
                <img src={logo} alt="logo" className="logoNav" />
            </Link>
        </header>
        <ToastContainer />
        <div className="container max400 pt60">
            <div>
                <h2 className="mb4">
                    <b>Login</b>
                </h2>
                <p className="expText">Accede a tu expediente</p>
            </div>
            <div className="formGroup">
                <label htmlFor="email" className="block pb10">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    className="inputStyle"
                    ref={emailRef}
                />
            </div>
            <div className="formGroup">
                <label htmlFor="password" className="block pb10 pt20">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    className="inputStyle"
                    ref={passwordRef}
                />
            </div>
            <button
                type="button"
                className="initBt"
                onClick={signIn}
            >
                Iniciar Sesión
            </button>
            <Link className="right d-block mt14" to="./registerNormal">
                <p className="qa">¿Aun no tienes una cuenta?</p>
            </Link>
            <Link className="right d-block " to="./recoverPassword">
                <p className="qa">¿Olvidaste tu contraseña?</p>
            </Link>
        </div>
        <Waves />
    </div>
    )

}

export default LoginForm