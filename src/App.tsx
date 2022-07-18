import React, { useEffect, useRef } from "react";
import "./app.css";
import { Experience } from "./experience";

function App() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = document.querySelector("#webgl");
    if (canvas) Experience.getInstance(canvas);
  }, []);

  return <canvas id="webgl" ref={ref}></canvas>;
}

export default App;
