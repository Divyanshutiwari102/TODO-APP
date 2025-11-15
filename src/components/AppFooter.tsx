import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter: React.FC = () => {
  // Use your actual email address here
  const contactEmail = "your.email@example.com"; 

  return (
    <footer className="app-footer">
      <div className="footer-links">
        {/* Placeholder links for professional look */}
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        
        {/* FIXED: Contact Us link with mailto: */}
        <a href={`mailto:${contactEmail}`}>divyanshutiwari337@gmail.com</a>
      </div>
      <p style={{ marginTop: '10px', marginBottom: '0' }}>
        © {new Date().getFullYear()}  Todo. All rights reserved.
      </p>
    </footer>
  );
};

export default AppFooter;