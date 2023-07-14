import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <header>
        <h1 className="heading">Welcome to SES What</h1>
        <p className="subheading">Empowering Professors with Topic Modeling and Data Visualization</p>
        <Link to="/demo" className="demo-button">Try Our Demo</Link>
      </header>

      <section className="about-section">
        <div className="about-content">
          <h2 className="section-heading">About Us</h2>
          <p className="section-description">
            SES What is a cutting-edge platform that provides professors with powerful tools for topic modeling and data visualization. We empower educators to gain valuable insights from their data and make data-driven decisions in their teaching and research.
          </p>
        </div>
      </section>

      <section className="team-section">
        <h2 className="section-heading">Our Team</h2>
        <div className="team-members">
          <div className="team-member">
            <img src="team-member1.jpg" alt="Team Member 1" />
            <h3 className="team-member-name">John Doe</h3>
            <p className="team-member-role">Co-founder & CEO</p>
          </div>
          <div className="team-member">
            <img src="team-member2.jpg" alt="Team Member 2" />
            <h3 className="team-member-name">Jane Smith</h3>
            <p className="team-member-role">Co-founder & CTO</p>
          </div>
          <div className="team-member">
            <img src="team-member3.jpg" alt="Team Member 3" />
            <h3 className="team-member-name">Alex Johnson</h3>
            <p className="team-member-role">Lead Developer</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2 className="section-heading">Contact Us</h2>
        <div className="contact-info">
          <p>Email: info@seswhat.com</p>
          <p>Phone: +1 123-456-7890</p>
          <p>Address: 123 Sesame Street, City, Country</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2023 SES What. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
