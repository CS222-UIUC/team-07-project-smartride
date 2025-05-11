import React from "react";
import { vi, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PointMarker from "@/components/maps/widgets/visuals/PointMarker";
import L from "leaflet";
import { Point } from "@/types/MapRoute";

// —— first mock react-leaflet's Marker/Popup
vi.mock("react-leaflet", () => ({
  Marker: ({
    children,
    position,
    icon,
  }: {
    children: React.ReactNode;
    position: [number, number];
    icon: L.Icon;
  }) => (
    <div
      data-testid="marker"
      data-pos={`${position[0].toString()},${position[1].toString()}`}
      data-icon={icon.options.iconUrl}
    >
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="popup">{children}</span>
  ),
}));

// —— spy createIcon will infact be new L.Icon ——
const spyIcon = vi.spyOn(L, "Icon");

describe("PointMarker components", () => {
  beforeEach(() => {
    spyIcon.mockClear();
  });

  it("points=[] Marker", () => {
    const { container } = render(<PointMarker points={[]} />);
    expect(container.querySelectorAll('[data-testid="marker"]')).toHaveLength(
      0,
    );
  });

  it("single point - green icon", () => {
    const pt: Point = {
      id: "p1",
      coordinates: { lat: 0, lng: 0, ele: 100 },
      label: "Start",
      type: "main" as const,
    }; // Add 'type' property
    render(<PointMarker points={[pt]} />);

    // 1 个 Marker
    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(1);

    // 图标 URL 包含 “marker-icon-green.png”
    expect(markers[0].getAttribute("data-icon")).toMatch(/marker-icon-green/);

    // Popup 内容正确
    expect(screen.getByTestId("popup")).toHaveTextContent("Start");
  });

  it("two points → first green second blue", () => {
    const pts = [
      { id: "p1", coordinates: { lat: 1, lng: 2, ele: 10 }, label: "A", type: "main" as const },
      { id: "p2", coordinates: { lat: 3, lng: 4, ele: 10 }, label: "B", type: "main" as const },
    ];
    render(<PointMarker points={pts} />);

    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(2);

    // 检查第一个/第二个图标 url
    expect(markers[0].getAttribute("data-icon")).toMatch(/marker-icon-green/);
    expect(markers[1].getAttribute("data-icon")).toMatch(/marker-icon-blue/);
  });

  it("three points → grey in the middle", () => {
    const pts = [
      {
      id: "p1",
      coordinates: { lat: 0, lng: 0, ele: 100 },
      label: "Start",
      type: "main" as const,
      },
      {
      id: "p2",
      coordinates: { lat: 5, lng: 5, ele: 100 },
      label: "Mid",
      type: "main" as const,
      },
      {
      id: "p3",
      coordinates: { lat: 9, lng: 9, ele: 100 },
      label: "End",
      type: "main" as const,
      },
    ];
    render(<PointMarker points={pts} />);

    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(3);

    // idx=1 → icon grey
    expect(markers[1].getAttribute("data-icon")).toMatch(/marker-icon-grey/);
  });

  it("createIcon was used for correct number of times", () => {
    const pts = Array(10)
      .fill(0)
      .map((_, i) => ({
      id: i.toString(),
      coordinates: {
        lat: i,
        lng: i,
        ele: 100,
      },
      label: `P${i.toString()}`,
      type: "main" as const,
      }));
    render(<PointMarker points={pts} />);
    expect(spyIcon).toHaveBeenCalledTimes(3);
  });
});
