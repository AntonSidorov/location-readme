export interface ICoordinate {
  lat: number;
  lng: number;
}

export function isCoordinate(v: any): v is ICoordinate {
  return false;
}

export const positionToCoordinate = (p: Position): ICoordinate => ({
  lat: p.coords.latitude,
  lng: p.coords.longitude,
});
