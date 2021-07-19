import React, {useRef, useState} from "react";
import SegurisignController from "../controller/segurisign_controller";

const Segurisign = () => {
    const passwordRef = useRef(null);
    const seguriSignController = SegurisignController();
    const [logged, setLogged] = useState(false);
    const signIn = e => {
        e.preventDefault();
        seguriSignController.authenticate(passwordRef.current.value);
    }

    return (
        <div>
            <form>
                <input ref={passwordRef} type="password"/>
                <button onClick={signIn}>Entrar</button>
            </form>
        </div>
    )

}

export default Segurisign
