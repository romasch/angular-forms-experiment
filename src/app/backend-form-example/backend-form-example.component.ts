import {Component, OnInit} from '@angular/core';
import {BackendMockService} from './backend-mock.service';
import {ControlledInputImpl} from '../controlled-input';

@Component({
    selector: 'app-backend-form-example',
    templateUrl: './backend-form-example.component.html',
    styleUrls: ['./backend-form-example.component.scss'],
    providers: [BackendMockService]
})
export class BackendFormExampleComponent implements OnInit {

    form = {
        firstName: new ControlledInputImpl<string>(''),
        lastName: new ControlledInputImpl<string>(''),
    };
    submitted: string;

    constructor(private be: BackendMockService) {
    }

    ngOnInit(): void {
        this.fetch();
    }

    getJson(): string {
        const form = {
            firstName: this.form.firstName.value,
            lastName: this.form.lastName.value
        };
        return JSON.stringify(form);
    }

    private updateFirstName(name: string) {
        this.be.updateFirstName(name).subscribe(() => this.fetch());
    }

    private updateLastName(name: string) {
        this.be.updateLastName(name).subscribe(() => this.fetch());
    }

    private fetch() {
        this.be.getPerson().subscribe(p => {
            this.form.firstName = new ControlledInputImpl<string>(p.firstName, change => this.updateFirstName(change));
            this.form.lastName = new ControlledInputImpl<string>(p.lastName, change => this.updateLastName(change));
        });
    }

}
