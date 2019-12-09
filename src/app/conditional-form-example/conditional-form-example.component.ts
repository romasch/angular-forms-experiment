import {Component} from '@angular/core';
import {textInput} from '../controlled-input';

@Component({
    selector: 'app-conditional-form-example',
    templateUrl: './conditional-form-example.component.html',
    styleUrls: ['./conditional-form-example.component.scss']
})
export class ConditionalFormExampleComponent {

    form = {
        customerType: textInput({initialValue: 'P'}),
        privateCustomer: {
            firstName: textInput(),
            lastName: textInput(),
        },
        companyCustomer: {
            name: textInput()
        }
    };

    submitted: string;

    submit(): boolean {
        this.submitted = this.getJson();
        return false;
    }

    getJson(): string {
        const form = {
            firstName: this.form.privateCustomer.firstName.value,
            lastName: this.form.privateCustomer.lastName.value,
            companyName: this.form.companyCustomer.name.value
        };
        return JSON.stringify(form);
    }
}
