import React from "react";
import { ViewportContext } from "../context/viewport";

/**
 *
 * @returns return width ,height of current device and check mobile device status
 */
const useViewport = () => {
  const { width, height } = React.useContext(ViewportContext);
  const isMobile = 1000 > width;
  const isLaptop = 1370 > width;
  return { width, height, isMobile, isLaptop };
};

export default useViewport;
