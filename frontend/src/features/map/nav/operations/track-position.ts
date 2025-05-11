import { toast } from "sonner";

export const startPositionTracking = (
  onUpdate: (pos: [number, number]) => void
): number => {
  return navigator.geolocation.watchPosition(
    ({ coords }) => {
      onUpdate([coords.latitude, coords.longitude]);
    },
    (error) => {
      console.error("Geolocation error:", error);
      toast.error("Unable to retrieve your location. Please check your device settings.");
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );
};

export const stopPositionTracking = (watchId: number) => {
  navigator.geolocation.clearWatch(watchId);
};
