"use client";

import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

interface TypedProps {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  loop?: boolean;
  showCursor?: boolean;
}

const TypedComponent = ({
  strings,
  typeSpeed = 50,
  backSpeed = 50,
  loop = true,
  showCursor = false,
}: TypedProps) => {
  const el = React.useRef<HTMLSpanElement | null>(null);
  const typed = useRef<Typed | null>(null);

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, {
        strings,
        typeSpeed,
        backSpeed,
        loop,
        showCursor,
      });
    }
    return () => {
      // Destroy Typed instance during cleanup to stop animation
      if (typed.current) {
        typed.current.destroy();
      }
    };
  }, [strings, typeSpeed, backSpeed, loop]);

  return (
    <span
      className="text-site dark:text-white text-2xl lg:text-3xl mt-5 text-center tracking-wider h-8"
      ref={el}
    />
  );
};

export default TypedComponent;
