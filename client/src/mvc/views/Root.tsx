import { Outlet } from "react-router";
import { useEffect, useState } from "react";

export function Root() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [followerPos, setFollowerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFollowerPos((prev) => ({
        x: prev.x + (cursorPos.x - prev.x) * 0.1,
        y: prev.y + (cursorPos.y - prev.y) * 0.1,
      }));
    }, 16);

    return () => clearInterval(timer);
  }, [cursorPos]);

  return (
    <>
      <div
        className="cursor"
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />
      <div
        className="cursor-follower"
        style={{ left: `${followerPos.x}px`, top: `${followerPos.y}px` }}
      />
      <Outlet />
    </>
  );
}
