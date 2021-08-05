/* eslint-disable operator-linebreak */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "reactfire";
import uuid from "react-uuid";
import "./alerts.css";

const Alerts = () => {
  const firebase = useFirebaseApp();
  const [alerts, setAlerts] = useState([]);

  function appendAlerts() {
    const al = [];
    if (firebase.auth().currentUser.emailVerified) {
      console.log("verified");
    } else {
      console.log("not verified");
      al.push("No has confirmado tu correo.");
      setAlerts(al);
      document.getElementById("count").innerHTML = al.length;
    }
  }

  useEffect(() => {
    appendAlerts();
  }, []);

  return (
    <div>
      <h4 className="option">
        <b>Notificaciones</b>
      </h4>
      <div className="pl20 pr20">
        {alerts.length &&
          alerts.map((projName) => (
            <div className="alertDiv">
              <p className="mb0" key={uuid()}>
                {projName}
              </p>
            </div>
          ))}
      </div>
      <li className="sign-in" />
    </div>
  );
};

export default Alerts;
