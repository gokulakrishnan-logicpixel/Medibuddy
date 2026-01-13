import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import illu1 from "../assets/illu-1.svg";
import illu2 from "../assets/illu-2.svg";
import illu3 from "../assets/illu-3.svg";
import illu4 from "../assets/illu-4.svg";
import illu5 from "../assets/illu-5.svg";
import illu6 from "../assets/illu-6.svg";
import illu7 from "../assets/illu-7.svg";
import illu8 from "../assets/illu-8.svg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* HERO WRAPPER */}
      <div className="hero-wrapper">
        {/* HERO CONTENT */}
        <div className="hero-content">
          <h1>
            <span className="highlight">Your Personal</span>{" "}
            <span className="white">Health Assistant</span>{" "}
            <span className="highlight">Is Here</span>
          </h1>

          <button
            className="get-started-btn"
            onClick={() => navigate("/chat")}
          >
            GET STARTED
          </button>
        </div>

        {/* ILLUSTRATIONS AROUND HERO */}
        <img src={illu1} className="illu illu-1" alt="" />
        <img src={illu2} className="illu illu-2" alt="" />
        <img src={illu3} className="illu illu-3" alt="" />
        <img src={illu4} className="illu illu-4" alt="" />
        <img src={illu5} className="illu illu-5" alt="" />
        <img src={illu6} className="illu illu-6" alt="" />
        <img src={illu7} className="illu illu-7" alt="" />
        <img src={illu8} className="illu illu-8" alt="" />
      </div>
    </div>
  );
};

export default Home;
