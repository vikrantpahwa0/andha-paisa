// src/components/mini-games/CSSCustomWheel.jsx
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { spinWheel } from "../../store/slices/spin-slice";
import "./CSSCustomWheel.css";

const CSSCustomWheel = ({ prizes, onSpinEnd, size = 400 }) => {
  const dispatch = useDispatch();
  const [initState, setInitState] = useState(true);
  const [randIndex, setRandIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(true);
  const spinningRef = useRef(false);

  const spin = () => {
    if (!isFinished || spinningRef.current) return;

    spinningRef.current = true;
    setIsFinished(false);

    // Call backend API instead of client-side selection
    dispatch(spinWheel()).then((result) => {
      if (result.payload?.data) {
        const { prize, rotationAngle } = result.payload.data;

        // Find the index of the prize that matches backend result
        const prizeIndex = prizes.findIndex((p) => p.name === prize.name);

        if (prizeIndex !== -1) {
          setRandIndex(prizeIndex);
        }

        // Animate wheel
        setInitState(false);

        // Wait for animation to complete
        setTimeout(() => {
          setIsFinished(true);
          spinningRef.current = false;
          if (onSpinEnd) onSpinEnd(prize);
        }, 3000);
      } else {
        // If API fails, reset
        setIsFinished(true);
        spinningRef.current = false;
        setInitState(true);
        if (onSpinEnd)
          onSpinEnd({
            name: "Error",
            value: 0,
            error: true,
            message: "Spin failed",
          });
      }
    });
  };

  const resetWheel = () => {
    if (isFinished) {
      setInitState(true);
      setRandIndex(0);
    }
  };

  const sidePercent =
    ((size -
      Math.tan((45 - 360 / prizes.length / 2) * (Math.PI / 180)) * size) /
      size) *
    100;

  // Dynamic styles matching your theme
  const containerStyle = {
    width: size,
    height: size,
    position: "relative",
    margin: "0 auto",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    borderRadius: "50%",
    background: "#f8fafc",
  };

  const wheelStyle = {
    border: `solid 4px #e2e8f0`,
    transform: initState
      ? "rotate(0deg)"
      : `rotate(-${720 + randIndex * (360 / prizes.length)}deg)`,
    transition: !initState
      ? `transform ${3}s cubic-bezier(0.2, 0.9, 0.4, 1.1)`
      : "none",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  };

  const spinButtonStyle = {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "all 0.2s",
  };

  const resetButtonStyle = {
    ...spinButtonStyle,
    background: "linear-gradient(135deg, #94a3b8, #64748b)",
    cursor: isFinished ? "pointer" : "not-allowed",
    opacity: isFinished ? 1 : 0.5,
  };

  return (
    <div style={containerStyle} className="spin-container">
      {initState ? (
        <button onClick={spin} style={spinButtonStyle} className="spin-btn">
          SPIN
        </button>
      ) : (
        <button
          onClick={resetWheel}
          disabled={!isFinished}
          style={resetButtonStyle}
          className="spin-btn"
        >
          RESET
        </button>
      )}
      <div style={wheelStyle} className="spin-wheel">
        {prizes.map((prize, index) => (
          <div
            key={prize.name}
            className="option"
            style={{
              backgroundColor: prize.color || `hsl(${index * 45}, 70%, 65%)`,
              transform: `rotate(${(360 / prizes.length) * index + 45}deg)`,
              clipPath: `polygon(0 0, ${sidePercent}% 0, 100% 100%, 0 ${sidePercent}%)`,
              position: "absolute",
              top: 0,
              left: 0,
              height: "50%",
              width: "50%",
              transformOrigin: "bottom right",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <span
              style={{
                color: "#fff",
                transform: "rotate(45deg)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                fontSize: size / 26,
                fontWeight: 600,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {prize.name.length > 12
                ? prize.name.slice(0, 10) + ".."
                : prize.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSSCustomWheel;
