import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable()
export class ValidationService {

    validateRequired(str: string): boolean {
        return !isNullOrUndefined(str) && str !== '';
    }

    validateEmail(email: string): boolean {
        return /\S+@\S+\.\S+/.test(email);
    }

    validateValidCombination(a: string, b: string): Observable<boolean> {
        return of(a !== 'Roman' || b !== 'Schmocker').pipe(delay(500));
    }

    validateUnique(str: string): Observable<boolean> {
        return of(str !== 'duplicate@email.ch').pipe(delay(500));
    }
}
