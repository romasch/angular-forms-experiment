import {Component} from '@angular/core';
import {ControlledInputImpl} from '../controlled-input';

@Component({
    selector: 'app-simple-form-example',
    templateUrl: './simple-form-example.component.html',
    styleUrls: ['./simple-form-example.component.scss']
})
export class SimpleFormExampleComponent {

    form = {
        firstName: new ControlledInputImpl<string>(''),
        lastName: new ControlledInputImpl<string>(''),
    };

    submitted: string;

    submit(): boolean {
        this.submitted = this.getJson();
        return false;
    }

    getJson(): string {
        const form = {firstName: this.form.firstName.value, lastName: this.form.lastName.value};
        return JSON.stringify(form, undefined, 2);
    }

}
