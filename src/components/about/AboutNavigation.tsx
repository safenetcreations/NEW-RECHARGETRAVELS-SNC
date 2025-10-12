
import React from 'react';

const AboutNavigation = () => {
  return (
    <nav id="about-navbar" className="fixed top-0 w-full px-12 py-5 z-50">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-yellow-400">Recharge Travels</div>
        <ul className="flex gap-8 list-none">
          <li><a href="#home" className="text-white hover:text-yellow-400 transition-colors duration-300">Home</a></li>
          <li><a href="#history" className="text-white hover:text-yellow-400 transition-colors duration-300">History</a></li>
          <li><a href="#experiences" className="text-white hover:text-yellow-400 transition-colors duration-300">Experiences</a></li>
          <li><a href="#destinations" className="text-white hover:text-yellow-400 transition-colors duration-300">Destinations</a></li>
          <li><a href="#wildlife" className="text-white hover:text-yellow-400 transition-colors duration-300">Wildlife</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default AboutNavigation;
