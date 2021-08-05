import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Segurisign from "../Segurisign/Segurisign";
import SafeQR from "../SafeQR/SafeQR";
import NavBar from "../Navbar/Navbar";
import storage, {auth, db} from "../../controller/firebase_controller";
import {IoPersonCircle} from "react-icons/all";
import './home.css'
import SIBUser from "../../model/sib_user";
import {Image} from "react-bootstrap";

const Home = () => {
    const uid = auth.currentUser.uid;
    const [loadingImg, setLoadingImg] = useState({loading: true, src: ''});
    const [setup, setSetUp] = useState(false);
    const [user, setData] = useState({});
    const getUserInfo = async () => {
        const userSaved = localStorage.getItem("user");
        return userSaved === null ? await getData() : JSON.parse(userSaved);
    }

    const getData = async () => {
        const userRef = db.collection('users');
        const query = userRef.where("uid", "==", uid);
        let loadedUser;
        await query.get().then((querySnapshot) => {
            querySnapshot.forEach((documentSnapshot) => {
                const data = documentSnapshot.data();
                loadedUser = new SIBUser(data);
                setData(loadedUser);
            });
            localStorage.setItem("user", JSON.stringify(loadedUser));
        });
        return loadedUser;
    }

    const loadPicture = (response) => {
        document.getElementById("picProfile").src = response;
    }

    const checkPicture = () => {
        const route = `users/${auth.currentUser.email}/croppedFace.png`;
        return storage
            .ref(route)
            .getDownloadURL()
    }

    useEffect(() => {
        if (!setup) {
            getUserInfo().then((userData) => setData(userData));
            checkPicture()
                .then((response) => setLoadingImg({loading: false, src: response}))
                .catch((e) => console.log(e));
            setSetUp(true);
        }
    }, [checkPicture, getUserInfo, loadingImg, setup]);

    return (
        <Router>
            <div className="center">
                <NavBar/>
                <Switch>
                    <Route path="/segurisign">
                        <Segurisign/>
                    </Route>
                    <Route path="/safeqr">
                        <SafeQR/>
                    </Route>
                    <Route path={["/","/home"]}>
                        <h1 className="welcomeTitle pt40 mb20">Seguridata in a box</h1>
                        <div style={{'margin-bottom':'2rem'}} className="container max500">
                            <Link to="/perfil">
                                <div className="cardDashboard pt10">
                                    <div className="row">
                                        <div className="col pl30 max40">
                                            {loadingImg.loading ? (
                                                <IoPersonCircle className="iconPerson d-block mx-auto"/>
                                            ) : (
                                                <div>
                                                    <Image id="picProfile" src={loadingImg.src} className='iconPerson d-block mx-auto' roundedCircle/>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col min50">
                                            <p className="mb0">
                                                <b>{user.fullname}</b>
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

                    </Route>
                </Switch>
            </div>

        </Router>
    )
}

export default Home