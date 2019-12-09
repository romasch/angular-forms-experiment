import {Component, OnInit} from '@angular/core';
import {BackendMockService} from './backend-mock.service';
import {textInput} from '../controlled-input';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-backend-form-example',
    templateUrl: './backend-form-example.component.html',
    styleUrls: ['./backend-form-example.component.scss'],
    providers: [BackendMockService]
})
export class BackendFormExampleComponent implements OnInit {

    form = {
        firstName: textInput({onValuePublishedSubscribers: [change => this.updateFirstName(change)]}),
        lastName: textInput({onValuePublishedSubscribers: [change => this.updateLastName(change)]}),
        street: textInput({onValuePublishedSubscribers: [change => this.updateStreet(change)]}),
    };

    constructor(private be: BackendMockService) {
        // Testing for conflicts.
        // setInterval(() => this.be.updateLastName(Math.random().toString()).subscribe(() => this.fetch()), 1000);
    }

    ngOnInit(): void {
        this.fetch();
    }

    getJson(): string {
        const form = {
            firstName: this.form.firstName.value,
            lastName: this.form.lastName.value,
            street: this.form.street.value
        };
        return JSON.stringify(form);
    }

    search = (text$: Observable<string>) => text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.be.getStreetForAutoComplete(term)))

    private updateFirstName(name: string) {
        this.be.updateFirstName(name).subscribe(() => this.fetch());
    }

    private updateLastName(name: string) {
        this.be.updateLastName(name).subscribe(() => this.fetch());
    }

    private updateStreet(name: string) {
        this.be.updateStreet(name).subscribe(() => this.fetch());
    }

    private fetch() {
        // TODO: this.form.firstName.setValue() would definitely be nicer.
        this.be.getPerson().subscribe(p => {
            this.form.firstName = textInput({
                initialValue: p.firstName,
                onValuePublishedSubscribers: [change => this.updateFirstName(change)]
            });
            this.form.lastName = textInput({
                initialValue: p.lastName,
                onValuePublishedSubscribers: [change => this.updateLastName(change)]
            });
            this.form.street = textInput({
                initialValue: p.street,
                onValuePublishedSubscribers: [change => this.updateStreet(change)]
            });
        });
    }

}
