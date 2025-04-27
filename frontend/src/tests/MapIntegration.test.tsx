// tests/MapIntegration.test.tsx
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouteOperations } from "@/maps/manage/operations";
import PointMarker from "@/maps/widgets/PointMarker";
import MapView from "@/maps/MapView";
import { Point, RouteSegment } from "@/maps/manage/structure";

const useSetupRouteOperations = (initialData: {
  points: Array<Point>;
  segments: Array<RouteSegment>;
}) => {
  const {
    points,
    segments,
    addPoint,
    removePoint,
    reorderPoints,
    togglePointType,
  } = useRouteOperations(initialData.points, initialData.segments);

  return {
    points,
    segments,
    addPoint,
    removePoint,
    reorderPoints,
    togglePointType,
  };
};

// —— Mock react-leaflet's Marker/Popup, use data-testid to display iconUrl ——
vi.mock("react-leaflet", () => ({
  Marker: ({
    children,
    position,
    icon,
  }: {
    children: React.ReactNode;
    position: [number, number];
    icon: { options: { iconUrl: string } };
  }) => (
    <div
      data-testid="marker"
      data-pos={`${String(position[0])},${String(position[1])}`}
      data-icon={icon.options.iconUrl}
    >
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="popup">{children}</span>
  ),
}));

// —— Mock getRoute, all route requests return empty arrays ——
vi.mock("@/api/ors/calc_route.ts", () => ({
  calcRoute: vi.fn(() => Promise.resolve({ route: [] })),
}));

// —— Mock MapView, render a div, return fixed coordinates when clicked ——
vi.mock("@/maps/MapView", () => {
  const MockMapView: React.FC<{
    onRouteDataChange: (data: {
      points: Array<{
        id: string;
        lat: number;
        lng: number;
        label: string;
        ele: number;
        type: string;
      }>;
      segments: Array<RouteSegment>;
    }) => void;
    initialData: { points: Array<Point>; segments: Array<RouteSegment> };
  }> = ({ onRouteDataChange }) => (
    <div
      data-testid="map"
      onClick={() => {
        onRouteDataChange({
          points: [
            {
              id: "1",
              lat: 10,
              lng: 20,
              label: "Point 1",
              ele: 0,
              type: "default",
            },
          ],
          segments: [],
        });
      }}
    >
      [Map]
    </div>
  );
  return {
    __esModule: true,
    default: MockMapView,
  };
});

const TestWrapper = () => {
  const { points, addPoint } = useSetupRouteOperations({
    points: [],
    segments: [],
  });
  return (
    <>
      <MapView
        onRouteDataChange={({ points }) => {
          const lastPoint = points[points.length - 1];
          void addPoint(lastPoint.lat, lastPoint.lng);
        }}
        initialData={{ points: [], segments: [] }}
      />
      <PointMarker points={points} />
    </>
  );
};

describe("map click behavior", () => {
  it("click sequence 1/2/3, PointMarker displays correct colors: green → blue → (green, grey, blue)", async () => {
    render(<TestWrapper />);

    const mapElement = screen.getByTestId("map");

    // —— First click: one point, idx=0 → green icon ——
    await userEvent.click(mapElement);
    let markerElements = screen.getAllByTestId("marker");
    expect(markerElements).toHaveLength(1);
    expect(markerElements[0]).toHaveAttribute(
      "data-icon",
      expect.stringContaining("marker-icon-green"),
    );

    // —— Second click: two points, idx=0 green, idx=1 blue ——
    await userEvent.click(mapElement);
    markerElements = screen.getAllByTestId("marker");
    expect(markerElements).toHaveLength(2);
    expect(markerElements[0]).toHaveAttribute(
      "data-icon",
      expect.stringContaining("marker-icon-green"),
    );
    expect(markerElements[1]).toHaveAttribute(
      "data-icon",
      expect.stringContaining("marker-icon-blue"),
    );

    // —— Third click: three points, idx=0 green, idx=1 grey (middle point), idx=2 blue ——
    await userEvent.click(mapElement);
    markerElements = screen.getAllByTestId("marker");
    expect(markerElements).toHaveLength(3);
    expect(markerElements[0]).toHaveAttribute(
      "data-icon",
      expect.stringContaining("marker-icon-green"),
    );
    expect(markerElements[1]).toHaveAttribute(
      "data-icon",
      expect.stringContaining("marker-icon-grey"),
    );
    expect(markerElements[2]).toHaveAttribute(
      "data-icon",
      expect.stringContaining("marker-icon-blue"),
    );

    // —— Verify labels are correctly displayed through Popup ——
    const popupElements = screen.getAllByTestId("popup");
    expect(popupElements.map((popup) => popup.textContent)).toEqual([
      "Point 1",
      "Point 2",
      "Point 3",
    ]);
  });
});
