import {
  setUserPosition,
  appendToRealCoords,
  setNearestIndex,
  getFlatCoords,
} from "../state";
import { findNearestIndex } from "./match-segment";

/**
 * Called on each GPS position update.
 */
export const handlePositionUpdate = (pos: [number, number]) => {
  setUserPosition(pos);
  appendToRealCoords(pos);

  const flat = getFlatCoords();
  const index = findNearestIndex(flat, pos);
  if (index !== -1) {
    setNearestIndex(index);
  }
};
