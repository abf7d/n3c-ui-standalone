import {Injectable} from '@angular/core';
import {geoAlbers, geoConicEqualArea} from 'd3-geo';

@Injectable()
export class AlbersUSATerritoriesProjectionService {
  public geoAlbersUsaTerritories(): any {
    let cache: any,
      cacheStream: any,
      lower48 = geoAlbers(),
      lower48Point: any,
      alaska = geoConicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]),
      alaskaPoint: any,
      hawaii = geoConicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]),
      hawaiiPoint: any,
      puertoRico = geoConicEqualArea().rotate([66, 0]).center([0, 18]).parallels([8, 18]),
      puertoRicoPoint: any,
      guamMariana = geoConicEqualArea().rotate([-145, 0]).center([0, 16]).parallels([10, 20]),
      guamMarianaPoint: any,
      americanSamoa = geoConicEqualArea().rotate([170, 0]).center([0, -14]).parallels([-14, 0]),
      americanSamoaPoint: any,
      point,
      pointStream = {
        point: function (x: any, y: any) {
          point = [x, y];
        }
      };

    function albersUsa(coordinates: any) {
      var x = coordinates[0],
        y = coordinates[1];
      return (
        (point = null),
        (lower48Point.point(x, y), point) ||
          (alaskaPoint.point(x, y), point) ||
          (hawaiiPoint.point(x, y), point) ||
          (puertoRicoPoint.point(x, y), point) ||
          (guamMarianaPoint.point(x, y), point) ||
          (americanSamoaPoint.point(x, y), point)
      );
    }

    albersUsa.invert = function (coordinates: any) {
      var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
      // @ts-ignore
      return (
        y >= 0.12 && y < 0.234 && x >= -0.225 && x < -0.185
          ? alaska
          : y >= 0.166 && y < 0.234 && x >= -0.185 && x < -0.08
            ? hawaii
            : y >= 0.204 && y < 0.234 && x >= 0.3 && x < 0.38
              ? puertoRico
              : y >= 0.05 && y < 0.204 && x >= -0.415 && x < -0.225
                ? guamMariana
                : y >= 0.18 && y < 0.234 && x >= -0.415 && x < -0.225
                  ? americanSamoa
                  : lower48
      ).invert(coordinates);
    };

    albersUsa.stream = function (stream: any) {
      return cache && cacheStream === stream
        ? cache
        : (cache = multiplex([
            lower48.stream((cacheStream = stream)),
            alaska.stream(stream),
            hawaii.stream(stream),
            puertoRico.stream(stream),
            guamMariana.stream(stream),
            americanSamoa.stream(stream)
          ]));
    };

    albersUsa.precision = function (_: any) {
      if (!arguments.length) return lower48.precision();
      (lower48.precision(_),
        alaska.precision(_),
        hawaii.precision(_),
        puertoRico.precision(_),
        guamMariana.precision(_),
        americanSamoa.precision(_));
      return reset();
    };

    albersUsa.scale = function (_: any) {
      if (!arguments.length) return lower48.scale();
      (lower48.scale(_),
        alaska.scale(_ * 0.35),
        hawaii.scale(_),
        puertoRico.scale(_),
        guamMariana.scale(_),
        americanSamoa.scale(_));
      return albersUsa.translate(lower48.translate());
    };

    albersUsa.translate = function (_: any) {
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(),
        x = +_[0],
        y = +_[1];

      lower48Point = lower48
        .translate(_)
        .clipExtent([
          [x - 0.455 * k, y - 0.238 * k],
          [x + 0.455 * k, y + 0.238 * k]
        ])
        // @ts-ignore
        .stream(pointStream);

      alaskaPoint = alaska
        .translate([x - 0.275 * k, y + 0.201 * k])
        .clipExtent([
          [x - 0.425 * k + epsilon, y + 0.12 * k + epsilon],
          [x - 0.185 * k - epsilon, y + 0.234 * k - epsilon]
        ])
        // @ts-ignore
        .stream(pointStream);

      hawaiiPoint = hawaii
        .translate([x - 0.18 * k, y + 0.212 * k])
        .clipExtent([
          [x - 0.185 * k + epsilon, y + 0.166 * k + epsilon],
          [x - 0.08 * k - epsilon, y + 0.234 * k - epsilon]
        ])
        // @ts-ignore
        .stream(pointStream);

      puertoRicoPoint = puertoRico
        .translate([x + 0.335 * k, y + 0.224 * k])
        .clipExtent([
          [x + 0.3 * k, y + 0.204 * k],
          [x + 0.38 * k, y + 0.234 * k]
        ])
        // @ts-ignore
        .stream(pointStream);

      guamMarianaPoint = guamMariana
        .translate([x - 0.415 * k, y + 0.14 * k])
        .clipExtent([
          [x - 0.45 * k, y + 0.05 * k],
          [x - 0.39 * k, y + 0.21 * k]
        ])
        // @ts-ignore
        .stream(pointStream);

      americanSamoaPoint = americanSamoa
        .translate([x - 0.415 * k, y + 0.215 * k])
        .clipExtent([
          [x - 0.45 * k, y + 0.21 * k],
          [x - 0.39 * k, y + 0.234 * k]
        ])
        // @ts-ignore
        .stream(pointStream);

      return reset();
    };
    const epsilon = 0.000001;
    function reset() {
      cache = cacheStream = null;
      return albersUsa;
    }

    return albersUsa.scale(1070) as AlbersUSATerritoriesProjection;
  }
}
export interface AlbersUSATerritoriesProjection {
  (coordinates: [number, number]): [number, number] | null;
  invert(coordinates: [number, number]): [number, number];
  stream(stream: any): any;
  precision(precision?: number): number | AlbersUSATerritoriesProjection;
  scale(scale?: number): number | AlbersUSATerritoriesProjection;
  translate(translate?: [number, number]): [number, number] | AlbersUSATerritoriesProjection;
}

function multiplex(streams: any) {
  const n = streams.length;
  return {
    point(x: any, y: any) {
      for (const s of streams) s.point(x, y);
    },
    sphere() {
      for (const s of streams) s.sphere();
    },
    lineStart() {
      for (const s of streams) s.lineStart();
    },
    lineEnd() {
      for (const s of streams) s.lineEnd();
    },
    polygonStart() {
      for (const s of streams) s.polygonStart();
    },
    polygonEnd() {
      for (const s of streams) s.polygonEnd();
    }
  };
}
