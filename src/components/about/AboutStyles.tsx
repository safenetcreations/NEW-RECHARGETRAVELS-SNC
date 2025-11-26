
import React from 'react';

const AboutStyles = () => {
  return (
    <style>{`
      :root {
        --primary-green: #0a4d3c;
        --accent-gold: #d4af37;
        --ocean-blue: #006994;
        --sandy-beige: #f5e6d3;
        --text-dark: #1a1a1a;
        --glass-white: rgba(255, 255, 255, 0.1);
      }

      .hero-bg {
        background: linear-gradient(135deg, #0a4d3c 0%, #006994 50%, #d4af37 100%);
        animation: gradientShift 10s ease infinite;
      }

      @keyframes gradientShift {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(5deg); }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 1s ease forwards;
      }

      .fade-in {
        opacity: 0;
        transform: translateY(30px);
      }

      .experience-card {
        background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
        border: 1px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .experience-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, var(--accent-gold) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .experience-card:hover::before {
        opacity: 0.1;
      }

      .experience-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      }

      .destination-card {
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.3s ease;
      }

      .destination-card:hover {
        background: rgba(255,255,255,0.15);
        transform: scale(1.02);
      }

      .wildlife-item {
        background: var(--ocean-blue);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .wildlife-item:hover {
        transform: scale(1.05);
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }

      .wildlife-overlay {
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      }

      #about-navbar {
        background: rgba(10, 77, 60, 0.95);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }

      #about-navbar.scrolled {
        background: rgba(10, 77, 60, 0.98);
      }

      .map-overlay {
        background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
      }
    `}</style>
  );
};

export default AboutStyles;
