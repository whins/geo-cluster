export interface ICoordinate {
	latitude: number;
	longitude: number;
}

export interface ICluster {
	centroid: ICoordinate;
	elements: ICoordinate[];
}

export class GeoCluster {
	clusters: ICluster[] = [];

	private coordinates: ICoordinate[] = [];

	private biases = [1, 1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05, 0.03, 0.01, 0.004, 0.001, 0.0009, 0.00065, 0.00035, 0.0001, 0.00008, 0.00004, 0.00002, 0.00001, 0.000005];

	constructor(coordinates: ICoordinate[], zoom = 1) {
		zoom > 20 && (zoom = 20), zoom < 1 && (zoom = 1);

		this.coordinates = coordinates;
		this.init(this.coordinates, this.biases[zoom]);
	}

	private toRad = (a: number): number => (a * Math.PI) / 180;

	// geodetic distance approximation
	private distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const dlat = this.toRad(lat2 - lat1);
		const dlon = this.toRad(lon2 - lon1);
		const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.sin(dlon / 2) * Math.sin(dlon / 2) * Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2));
		return Math.round(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 6371 * 100) / 100;
	}

	private getCentroid(set: ICoordinate[]): ICoordinate {
		const centroid = set.reduce((s, e) => [s[0] + e.latitude, s[1] + e.longitude], [0, 0]).map(e => e / set.length);
		return { latitude: centroid[0], longitude: centroid[1] };
	}

	private clean(data: ICluster[]) {
		return data.map(cluster => {
			return [cluster.centroid, cluster.elements];
		});
	}

	private init(coordinates: ICoordinate[], bias = 1) {
		let totalDiff = 0;
		const diffs: any = [];

		coordinates.reduce((a, b) => {
			const d = this.distance(b.latitude, b.longitude, a.latitude, a.longitude);
			totalDiff += d;
			diffs.push(d);
			return b;
		});

		// calculate mean diff
		const meanDiff = totalDiff / diffs.length;
		let diffVariance = 0;

		// calculate variance total
		diffs.forEach((d:any) => {
			diffVariance += Math.pow(d - meanDiff, 2);
		});

		// derive threshold from stdev and bias
		const diffStdev = Math.sqrt(diffVariance / diffs.length);
		const threshold = diffStdev * bias;
		// const threshold = bias;

		// generate random initial cluster map
		this.clusters.push({
			centroid: { latitude: coordinates[0].latitude, longitude: coordinates[0].longitude },
			elements: []
		});

		// loop elements and distribute them to clusters
		let changing = true;
		while (changing === true) {
			let newCluster = false;
			let clusterChanged = false;

			// iterate over elements
			coordinates.forEach((elem, ei) => {
				let closestDist = Infinity;
				let closestCluster: any;

				// find closest cluster
				this.clusters.forEach((cluster, ci) => {
					// distance to cluster
					const dist = this.distance(elem.latitude, elem.longitude, this.clusters[ci].centroid.latitude, this.clusters[ci].centroid.longitude);

					if (dist < closestDist) {
						closestDist = dist;
						closestCluster = ci;
					}
				});

				// is the closest distance smaller than the stddev of elements?
				if (closestDist < threshold || closestDist === 0) {
					// put element into existing cluster
					this.clusters[closestCluster].elements.push(elem);
				} else {
					// create a new cluster with this element
					this.clusters.push({
						centroid: { latitude: elem.latitude, longitude: elem.longitude },
						elements: [elem]
					});

					newCluster = true;
				}
			});

			// delete empty clusters from cluster_map
			this.clusters = this.clusters.filter(cluster => {
				return cluster.elements.length > 0;
			});

			// calculate the clusters centroids and check for change
			this.clusters.forEach((cluster, ci) => {
				const centroid = this.getCentroid(cluster.elements);
				if (centroid.latitude !== cluster.centroid.latitude || centroid.longitude !== cluster.centroid.longitude) {
					this.clusters[ci].centroid = centroid;
					clusterChanged = true;
				}
			});

			// loop cycle if clusters have changed
			if (!clusterChanged && !newCluster) {
				changing = false;
			} else {
				// remove all elements from clusters and run again
				if (changing) {
					this.clusters = this.clusters.map(cluster => {
						cluster.elements = [];
						return cluster;
					});
				}
			}
		}
	}

	update(zoom = 1): ICluster[] {
		zoom = Math.round(zoom);
		zoom > 20 && (zoom = 20), zoom < 1 && (zoom = 1);
		this.init(this.coordinates, this.biases[zoom]);
		return this.clusters;
	}
}
