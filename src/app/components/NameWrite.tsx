"use client";
import { useNameWrite } from "@/context/NameWriteContext";

const NameWrite = () => {
  const { hasPlayed, setHasPlayed } = useNameWrite();
  return (
    <span
      className={`text-site dark:text-white text-2xl lg:text-3xl w-fit mt-5 text-center tracking-wider h-8 self-center justify-self-center ${
        !hasPlayed ? "cursor-animation animate-typewriter" : ""
      }`}
      onAnimationEnd={() => {
        setHasPlayed(true);
      }}
    >
      Nivaldo Dantas
    </span>
  );
};

export default NameWrite;
