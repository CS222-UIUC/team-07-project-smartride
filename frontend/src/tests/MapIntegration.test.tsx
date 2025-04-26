// tests/MapIntegration.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouteOperations } from '@/maps/operations';
import PointMarker from '../maps/widgets/PointMarker';
import MapView from '../maps/MapView';

// —— Mock react-leaflet's Marker/Popup，use data-testid show iconUrl —— 
jest.mock('react-leaflet', () => ({
  Marker: ({ children, position, icon }: { children: React.ReactNode; position: [number, number]; icon: { options: { iconUrl: string } } }) => (
    <div
      data-testid="marker"
      data-pos={`${String(position[0])},${String(position[1])}`}
      data-icon={icon.options.iconUrl}
    >
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <span data-testid="popup">{children}</span>,
}));

// —— Mock getRoute，all route request return empty arries —— 
jest.mock('@/api/map/route_service.ts', () => ({
  getRoute: jest.fn(() => Promise.resolve({ route: [] })),
}));

// —— Mock MapView，mark div，return fixed longitude when clicked —— 
jest.mock('../maps/MapView', () => {
  const MockMapView: React.FC<{ onMapClick: (event: { latlng: { lat: number; lng: number } }) => void }> = ({ onMapClick }) => (
    <div
      data-testid="map"
      onClick={() => { onMapClick({ latlng: { lat: 10, lng: 20 } }); }}
    >
      [Map]
    </div>
  );
  return {
    __esModule: true,
    default: MockMapView,
  };
});

// —— test container: hook + MapView + PointMarker —— 
const TestContainer = () => {
  const { points, addPoint } = useRouteOperations();
  return (
    <>
      <MapView onMapClick={({ latlng }) => addPoint(latlng.lat, latlng.lng)} />
      <PointMarker points={points} />
    </>
  );
};

describe('map click', () => {
  test('click 1/2/3, PointMarker show correct color:reen→blue→(green,grey,blue)', async () => {
    render(<TestContainer />);

    const map = screen.getByTestId('map');

    // —— first click：one pt，idx=0 → green icon —— 
    await userEvent.click(map);
    let markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(1);
    expect(markers[0]).toHaveAttribute('data-icon', expect.stringContaining('marker-icon-green'));

    // —— second click： two points，idx=0 green，idx=1 blue —— 
    await userEvent.click(map);
    markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);
    expect(markers[0]).toHaveAttribute('data-icon', expect.stringContaining('marker-icon-green'));
    expect(markers[1]).toHaveAttribute('data-icon', expect.stringContaining('marker-icon-blue'));

    // —— third click： three pt，idx=0 green，idx=1 grey（middle pt），idx=2 blue —— 
    await userEvent.click(map);
    markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(3);
    expect(markers[0]).toHaveAttribute('data-icon', expect.stringContaining('marker-icon-green'));
    expect(markers[1]).toHaveAttribute('data-icon', expect.stringContaining('marker-icon-grey'));
    expect(markers[2]).toHaveAttribute('data-icon', expect.stringContaining('marker-icon-blue'));

    // —— inspect label is marked corrected through Popup —— 
    const popups = screen.getAllByTestId('popup');
    expect(popups.map((n) => n.textContent)).toEqual([
      'Point 1',
      'Point 2',
      'Point 3',
    ]);
  });
});
