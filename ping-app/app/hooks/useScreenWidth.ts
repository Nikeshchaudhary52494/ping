"use client"

import { useState, useEffect } from "react";

const useScreenWidth = () => {
    const [screenWidth, setScreenWidth] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return screenWidth;
};

export default useScreenWidth;
