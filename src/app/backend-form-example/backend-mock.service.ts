import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';

export interface Person {
    firstName: string;
    lastName: string;
    street: string;
}

@Injectable()
export class BackendMockService {

    private person: Person = {firstName: 'John', lastName: 'Doe', street: 'street name'};

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

    updateStreet(street: string): Observable<void> {
        return of(street).pipe(delay(1000),
            map(x => {
                this.person.street = x;
                return undefined;
            }));
    }

    getStreetForAutoComplete(term: string): Observable<string[]> {
        const result: string[] = ['Merkurstrasse 28', 'Kleinstrasse 15', 'Falkenstrasse 28']
            .filter(d => d.toLowerCase().indexOf(term.toLowerCase()) !== -1);
        return of(result).pipe(delay(100));
    }

}
