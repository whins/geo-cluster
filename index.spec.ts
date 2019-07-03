import { Geocluster } from "./index";

describe("Geocluster", () => {
	beforeEach(function() {
		// spyOn(Geocluster.prototype, 'push').and.callThrough();
	});

	it("should create an instance", () => {
		let geo = new Geocluster(
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
