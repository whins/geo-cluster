export interface ICoordinate {
    latitude: number;
    longitude: number;
}
export interface ICluster {
    centroid: ICoordinate;
    elements: ICoordinate[];
}
export declare class Geocluster {
    clusters: ICluster[];
    private coordinates;
    private biases;
    constructor(coordinates: ICoordinate[], zoom?: number);
    private toRad;
    private distance;
    private getCentroid;
    private clean;
    private init;
    update(zoom?: number): ICluster[];
}
