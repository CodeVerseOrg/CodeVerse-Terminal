import React, { useEffect, useState } from "react";

export default function TypingLine({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 30);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [text, delay]);

  return <div>{displayed}</div>;
}
