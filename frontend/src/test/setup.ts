import "@testing-library/jest-dom";

// Mock HTMLCanvasElement.getContext for JSDOM environment in axe-core scans
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = () => null;
}
