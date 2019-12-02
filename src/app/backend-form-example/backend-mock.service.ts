import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';

export interface Person {
    firstName: string;
    lastName: string;
}

@Injectable()
export class BackendMockService {

    person: Person = {firstName: 'John', lastName: 'Doe'};

    getPerson(): Observable<Person> {
        return of(Object.assign({}, this.person));
    }

    updateFirstName(firstName: string): Observable<void> {
        return of(firstName).pipe(delay(1000),
            map(x => {
                this.person.firstName = x.toUpperCase();
                return undefined;
            }));
    }

    updateLastName(firstName: string): Observable<void> {
        return of(firstName).pipe(delay(1000),
            map(x => {
                this.person.lastName = x.toUpperCase();
                return undefined;
            }));
    }
}
