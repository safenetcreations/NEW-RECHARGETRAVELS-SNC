
const HeaderStyles = () => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');
      
      @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes walk {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes splash {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      @keyframes swim {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      @keyframes fly {
        0% { transform: translateX(0); }
        100% { transform: translateX(50px); }
      }
      @keyframes drop {
        0% { transform: translateY(-20px); }
        100% { transform: translateY(0); }
      }

      .animate-jump { animation: jump 0.6s ease; }
      .animate-walk { animation: walk 0.8s ease; }
      .animate-splash { animation: splash 0.7s ease; }
      .animate-swim { animation: swim 0.6s ease; }
      .animate-fly { animation: fly 1.2s linear; }
      .animate-drop { animation: drop 1s ease; }
    `}</style>
  )
}

export default HeaderStyles
