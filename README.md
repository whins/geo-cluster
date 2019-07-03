# geo-cluster

This is modification of [`geocluster`](https://www.npmjs.com/package/geocluster) on Typescript

## Install

```
npm install geo-cluster
```

## API

###let clusters: ICluster = new Geocluster(coordinates[, zoom]).clusters;

`coordinates` is an Array of `ICoordinate` `{ latitude: number; longitude: number; }`.
`zoom` value from 1 to 20.

`clusters` is an Array of cluster objects `ICluster`, which have `centroid` and `elements` properties. 

## Sample Code

``` typescript

import { ICoordinate, ICluster, Geocluster } from "geo-cluster";

let zoom = 2;

let coordinates: ICoordinate = [
    {
        latitude: 10,
        longitude: 20
    },
    {
        latitude: 20,
        longitude: 20
    },
    {
        latitude: 10,
        longitude: 30
    },
    {
        latitude: 40,
        longitude: 20
    }
];

let clusters: ICluster = new Geocluster(coordinates, zoom).clusters;

```

### Result

``` typescript
[
  {
    "centroid": {
      "latitude": 10.5,
      "longitude": 20.5
    },
    "elements": [
      {
        "latitude": 10,
        "longitude": 20
      },
      {
        "latitude": 11,
        "longitude": 21
      }
    ]
  },
  {
    "centroid": {
      "latitude": 40,
      "longitude": 34
    },
    "elements": [
      {
        "latitude": 40,
        "longitude": 35
      },
      {
        "latitude": 40,
        "longitude": 33
      }
    ]
  }
]
```
