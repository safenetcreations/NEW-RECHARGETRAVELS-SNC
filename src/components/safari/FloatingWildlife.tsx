
import React from 'react';

const FloatingWildlife: React.FC = () => {
  return (
    <>
      {/* Leopard Animation */}
      <div 
        className="fixed w-36 h-36 opacity-15 pointer-events-none z-10"
        style={{
          animation: 'floatLeopard 20s infinite ease-in-out',
          animationDelay: '0s'
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full relative overflow-hidden">
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
            <div className="absolute top-3 left-6 w-3 h-3 bg-black rounded-full"></div>
            <div className="absolute top-3 right-6 w-3 h-3 bg-black rounded-full"></div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Elephant Animation */}
      <div 
        className="fixed w-44 h-44 opacity-10 pointer-events-none z-10"
        style={{
          animation: 'floatElephant 25s infinite ease-in-out',
          animationDelay: '5s'
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-full relative">
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gray-700 rounded-t-full"></div>
          <div className="absolute top-12 left-6 w-4 h-4 bg-black rounded-full"></div>
          <div className="absolute top-12 right-6 w-4 h-4 bg-black rounded-full"></div>
        </div>
      </div>
      
      {/* Blue Whale Animation */}
      <div 
        className="fixed w-48 h-28 opacity-10 pointer-events-none z-10"
        style={{
          animation: 'floatWhale 30s infinite ease-in-out',
          animationDelay: '10s'
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-full relative">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-16 border-t-8 border-b-8 border-blue-700 border-t-transparent border-b-transparent"></div>
        </div>
      </div>
      
      {/* Dolphin Animation */}
      <div 
        className="fixed w-28 h-20 opacity-15 pointer-events-none z-10"
        style={{
          animation: 'floatDolphin 18s infinite ease-in-out',
          animationDelay: '15s'
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full relative">
          <div className="absolute top-1/3 left-6 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-t-4 border-b-4 border-blue-600 border-t-transparent border-b-transparent"></div>
        </div>
      </div>

      <style>
        {`
        @keyframes floatLeopard {
          0%, 100% { 
            transform: translate(-100px, 100vh) rotate(0deg); 
          }
          25% { 
            transform: translate(20vw, 80vh) rotate(90deg); 
          }
          50% { 
            transform: translate(40vw, 60vh) rotate(180deg); 
          }
          75% { 
            transform: translate(60vw, 40vh) rotate(270deg); 
          }
        }

        @keyframes floatElephant {
          0%, 100% { 
            transform: translate(100vw, 90vh) rotate(0deg); 
          }
          33% { 
            transform: translate(70vw, 70vh) rotate(120deg); 
          }
          66% { 
            transform: translate(30vw, 50vh) rotate(240deg); 
          }
        }

        @keyframes floatWhale {
          0%, 100% { 
            transform: translate(-200px, 50vh) rotateY(0deg); 
          }
          50% { 
            transform: translate(100vw, 30vh) rotateY(180deg); 
          }
        }

        @keyframes floatDolphin {
          0%, 100% { 
            transform: translate(100vw, 20vh) rotate(0deg) scale(1); 
          }
          25% { 
            transform: translate(75vw, 40vh) rotate(45deg) scale(1.2); 
          }
          50% { 
            transform: translate(25vw, 60vh) rotate(90deg) scale(0.8); 
          }
          75% { 
            transform: translate(10vw, 30vh) rotate(135deg) scale(1.1); 
          }
        }
        `}
      </style>
    </>
  );
};

export default FloatingWildlife;
