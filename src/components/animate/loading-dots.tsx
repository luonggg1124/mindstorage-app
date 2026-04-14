import { useState, useEffect } from "react";

const LoadingDots = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 500); // đổi tốc độ ở đây (ms)

    return () => clearInterval(interval);
  }, []);

  return dots;
};
export default LoadingDots;
