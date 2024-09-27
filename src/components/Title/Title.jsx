import React from 'react';
import './Title.css'

const Title = ({ title, description }) => {
  return (
    <div className="title_section">
      <div className="title_container">
        <h3>{title}</h3>
      </div>
      <div className="description_container">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Title;
