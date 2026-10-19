// import { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import {
  faInstagram
} from "@fortawesome/free-brands-svg-icons";

function App() {
  return (
    <div className="home-container">
        <div className="header-social">
          <a href="https://www.facebook.com/Romephan">
          <FontAwesomeIcon icon={faFacebookF} className="social-icon" />
          </a>
          <a href="https://www.instagram.com/txdtnals/">
          <FontAwesomeIcon icon={faInstagram} className="social-icon" />
          </a>
        </div>

          <h1>Gallery</h1>
          <div className="span-text">
            <p className="description-text">A record of Rachel and Rome.</p>
          </div>
        
          <div className="text-center">
            <a>ALL</a>
            <a>TRAVEL</a>
            <a>DAILY</a>
          </div>
        
        
        <div className="album-grid">
          <div className="album-container">
            <img src="../public/photos/IMG_7726.jpg" alt=""/>
            <div className="album-info">
              <div className="name">MELBOURNE TRIP 2026</div>
              <div className="date">22 - 24 JULY, 2026 </div>
            </div>
          </div>

          <div className="album-container">
            <img src="../public/photos/IMG_7942.jpg" alt=""/>
            <div className="album-info">
              <div className="name">GOLDCOAST TRIP 2026</div>
              <div className="date">18 JULY, 2026 </div>
            </div>
          </div>
          <div className="album-container">
            <img src="../public/photos/IMG_7942.jpg" alt=""/>
            <div className="album-info">
              <div className="name">GOLDCOAST TRIP 2026</div>
              <div className="date">18 JULY, 2026 </div>
            </div>
          </div>
        </div>
        
        
      </div>
      
  );
}

export default App;