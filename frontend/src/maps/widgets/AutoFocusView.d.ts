import { LatLngExpression } from "leaflet";
interface Props {
    points: LatLngExpression[];
    zoom?: number;
}
declare const AutoFocusView: ({ points, zoom }: Props) => null;
export default AutoFocusView;
