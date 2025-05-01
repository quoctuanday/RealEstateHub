declare module '@mapbox/polyline' {
    export function encode(
        points: [number, number][],
        precision?: number
    ): string;
    export function decode(str: string, precision?: number): [number, number][];
    export function fromGeoJSON(geojson: unknown, precision?: number): string;
    export function toGeoJSON(str: string, precision?: number): unknown;
}
