import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Segurisign from "../../src/components/Segurisign/Segurisign";
import SafeQR from "../../src/components/SafeQR/SafeQR";
import NavBar from "../../src/components/Navbar/Navbar";
import storage, {auth, db} from "../../src/controller/firebase_controller";
import {IoPersonCircle} from "react-icons/all";
import './home.css'

const Home = () => {
    const uid = auth.currentUser.uid;
    const [loading, setLoading] = useState(true);
    const [user, setData] = useState({name: 'User'});
    const getUserInfo = async () => {
        const userSaved = localStorage.getItem("user");
        return userSaved === null ? await getData() : JSON.parse(userSaved);
    }

    const getData = async () => {
        const userRef = db.collection('users');
        const query = userRef.where("uid", "==", uid);
        query.get().then((querySnapshot) => {
            console.log(querySnapshot)
            //localStorage.setItem("user", JSON.stringify(userGet));
            //resolve(userGet);
        });
        return {name: 'User'};
    }

    const loadPicture = (response) => {

        setLoading(false);
    }

    const checkPicture = () => {
        const route = `users/${uid}/croppedFace`;
        return storage
            .ref(route)
            .getDownloadURL()
    }

    useEffect(() => {
        getUserInfo().then((userData) => setData(userData));
        checkPicture()
            .then((response) => loadPicture(response))
            .catch((e) => console.log(e));
    }, []);

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <li>
                            <Link to="/segurisign">Segurisign</Link>
                        </li>
                        <li>
                            <Link to="/safeqr">SafeQR</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/segurisign">
                        <Segurisign/>
                    </Route>
                    <Route path="/safeqr">
                        <SafeQR/>
                    </Route>
                    <Route path="/home">
                    </Route>
                </Switch>
            </div>

            <div className="center">
                <NavBar/>
                <h1 className="welcomeTitle pt40 mb20">Expediente Digital</h1>
                <div className="container max500">
                    <Link to="/perfil">
                        <div className="cardDashboard pt10">
                            <div className="row">
                                <div className="col pl30 max40">
                                    {loading ? (
                                        <IoPersonCircle className="iconPerson d-block mx-auto"/>
                                    ) : (
                                        <div id="picProfile"/>
                                    )}
                                </div>
                                <div className="col min50">
                                    <p className="mb0">
                                        <b>{user.name}</b>
                                    </p>
                                    <p className="mt4 mb0">Frontend Developer</p>
                                    <p className="mt4 mb0">{user.email}</p>
                                    <p className="mt4">{user.rfc}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="container max500 mt14">
                    <div className="row">
                        <div className="col-md-6 mb10">
                            <div className="cardDashboard p10">
                                <Link to="/documents" style={{display: "block"}}>
                                    <h2>2</h2>
                                    <h5>Documentos</h5>
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="cardDashboard p10">
                                <Link to="/alertas" style={{display: "block"}}>
                                    <h2>0</h2>
                                    <h5>Alertas</h5>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Router>
    )
}

export default Home