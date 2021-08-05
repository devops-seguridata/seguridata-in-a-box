/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable quotes */
import React, { useState } from "react";
import firebase from "firebase";
import { FaRegBell, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ReactComponent as CloseMenu } from "../../../assets/x.svg";
import { ReactComponent as MenuIcon } from "../../../assets/menu.svg";
import logo from "../../../assets/logo.png";
import Alerts from "../alerts/alerts";
import "./navBar.css";

function NavBar() {
  const [click, setClick] = useState(false);
  const [alert, openAlert] = useState(false);
  const handleClick = () => setClick(!click);
  const handleBell = () => fetchAlerts();
  const closeMobileMenu = () => setClick(false);

  function logOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("logged out");
        localStorage.removeItem("user");
      })
      .catch((error) => {
        alert(error);
      });
  }

  function fetchAlerts() {
    console.log("opening");
    openAlert(!alert);
  }

  return (
    <div className="header shadow">
      <div className="logo-nav">
        <div className="logo-container">
          <a href="/dashboard">
            <img className="logo" alt="logo" src={logo} />
          </a>
        </div>
        <ul className={click ? "nav-options active" : "nav-options"}>
          <li className="option">
            <a href="/dashboard">Dashboard</a>
          </li>
          <li className="option">
            <a href="/perfil">Mi Perfil</a>
          </li>
          <li className="option">
            <a href="/documents">Documentos</a>
          </li>
          <li className="sign-in" onClick={closeMobileMenu}>
            <button type="button" onClick={() => logOut()} className="salirbt">
              <span>Salir</span>
            </button>
          </li>
        </ul>
        <ul className={alert ? "nav-optionsAlert active" : "nav-optionsAlert"}>
          <Alerts />
          <li className="sign-in" onClick={closeMobileMenu}>
            <Link to="/alertas" className="salirbt">
              <span>Ver todas</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="alertsCount">
        {" "}
        <p id="count" className="count" />
        <div
          role="button"
          tabIndex={0}
          className="mobile-menu bell ml-auto"
          onKeyDown={handleBell}
          onClick={handleBell}
        >
          {alert ? (
            <FaBell className="alert-icon" />
          ) : (
            <FaRegBell className="alert-icon" />
          )}
        </div>
      </div>
      <div
        role="button"
        className="mobile-menu"
        tabIndex={0}
        onKeyDown={handleClick}
        onClick={handleClick}
      >
        {click ? (
          <CloseMenu className="menu-icon" />
        ) : (
          <MenuIcon className="menu-icon" />
        )}
      </div>
    </div>
  );
}

export default NavBar;
