import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICoordinate, positionToCoordinate } from '../models';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  // Create an observable from the geolocation API for easier access
  // Known limitation: safari blocks location requests from insecure hosts
  current$ = new Observable<ICoordinate>((obs) => {
    // There is no reason to test that the callbacks on the watchPosition API work properly
    // Rather - there should be tests to make sure that if errors occur - an error is emitted in the observable

    /* istanbul ignore next */
    navigator.geolocation.watchPosition(
      (p) => obs.next(positionToCoordinate(p)),
      (_) => obs.error('Could not determine your current location. Please enable your location  to create notes'),
      { enableHighAccuracy: true }
    );
  });
}
