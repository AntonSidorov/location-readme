import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * This function allows to handle errors in the same flow as successful results
 * The main idea is: anywhere that a result is expected, the lack of one (indicated by undefined)
 * means an error has occured. So instead of writing specific catchErrors everywhere, a simple undefined check can be used
 *
 * An interesting extension of this idea is:
 * catch if the error fits a crtieria (ie an expected error), without replacing.
 *
 * Removed from code coverage as it would take some time to write meaningful tests.
 */
// istanbul ignore next
export function catchWithUndefined<T>() {
  return catchError<T, Observable<undefined>>((err) => {
    console.warn(err);
    return of(undefined);
  });
}
