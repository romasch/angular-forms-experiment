import {Component} from '@angular/core';
import {required, textInput} from '../controlled-input';

@Component({
    selector: 'app-simple-form-example',
    templateUrl: './simple-form-example.component.html',
    styleUrls: ['./simple-form-example.component.scss']
})
export class SimpleFormExampleComponent {

    form = {
        firstName: textInput({validations: [required]}),
        lastName: textInput(),
    };

    submitted: string;

    submit(): boolean {
        this.submitted = this.getJson();
        return false; // TODO: This is still a bit ugly. Maybe it can be solved with another directive.
    }

    getJson(): string {
        const form = {
            firstName: this.form.firstName.value,
            lastName: this.form.lastName.value
        };
        return JSON.stringify(form);
    }
}
