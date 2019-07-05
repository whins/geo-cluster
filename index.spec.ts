import { GeoCluster } from "./index";

describe("GeoCluster", () => {
	beforeEach(function() {
		// spyOn(GeoCluster.prototype, 'push').and.callThrough();
	});

	it("should create an instance", () => {
		let geo = new GeoCluster(
			[
				{
					latitude: 10,
					longitude: 20
				},
				{
					latitude: 11,
					longitude: 21
				},
				{
					latitude: 40,
					longitude: 35
				},
				{
					latitude: 40,
					longitude: 33
				}
			],
			3
		)
		expect(geo).toBeTruthy();
		console.log(JSON.stringify(geo.clusters));
	});
});
