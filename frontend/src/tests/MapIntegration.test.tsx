// tests/MapIntegration.test.tsx
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePlanController } from "@/features/map/controller";
import PointMarker from "@/components/maps/widgets/visuals/PointMarker";
import MapView from "@/components/maps/MapView";
import { PlanMapBindings } from "@/features/map/plan/props";

// ===== MOCKS =====
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

vi.mock("@/api/services/ors/calc_route.ts", () => ({
  calcRoute: vi.fn(() => Promise.resolve({ route: [] })),
}));

vi.mock("@/components/maps/MapView", () => {
  const MockMapView: React.FC<PlanMapBindings> = (props) => (
    <div
      data-testid="map"
      onClick={() => {
        props.onClickAddPoint(10 + props.routeData.points.length, 20);
      }}
    >
      [MockMapView]
    </div>
  );
  return {
    __esModule: true,
    default: MockMapView,
  };
});

// ===== TEST WRAPPER =====
const TestWrapper = () => {
  const { route, getMapBindings } = usePlanController();

  const bindings = getMapBindings();
  const overriddenBindings = {
    ...bindings,
    onClickAddPoint: (lat: number, lng: number) => {
      // mock addPoint, modify store directly (if needed), or leave as no-op
      bindings.onClickAddPoint(lat, lng);
    },
    onOpenPanel: () => {},
    onClosePanel: () => {},
    isPanelOpen: false,
  };

  return (
    <>
      <MapView {...overriddenBindings} />
      <PointMarker points={route.data.points} />
    </>
  );
};

// ===== TESTS =====
describe("map click behavior", () => {
  it("click sequence 1/2/3, PointMarker displays correct colors", async () => {
    render(<TestWrapper />);

    const mapElement = screen.getByTestId("map");

    await userEvent.click(mapElement);
    let markerElements = screen.getAllByTestId("marker");
    expect(markerElements).toHaveLength(1);
    expect(markerElements[0]).toHaveAttribute(
      "data-icon",
      expect.stringContaining("marker-icon-green"),
    );

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

    const popupElements = screen.getAllByTestId("popup");
    expect(popupElements.map((popup) => popup.textContent)).toEqual([
      "Point 1",
      "Point 2",
      "Point 3",
    ]);
  });
});
