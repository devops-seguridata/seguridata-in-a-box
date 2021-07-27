import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Segurisign from "./Segurisign/Segurisign";
import SafeQR from "./SafeQR/SafeQR";

const Home = () => {
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
                        <Segurisign />
                    </Route>
                    <Route path="/safeqr">
                        <SafeQR />
                    </Route>
                    <Route path="/home">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default Home