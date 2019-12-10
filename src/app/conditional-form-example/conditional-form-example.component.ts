import {Component} from '@angular/core';
import {textInput} from '../controlled-input';
import {toBootstrapClassList} from '../bootstrap-utils';

@Component({
    selector: 'app-conditional-form-example',
    templateUrl: './conditional-form-example.component.html',
    styleUrls: ['./conditional-form-example.component.scss']
})
export class ConditionalFormExampleComponent {

    toBootstrapClassList = toBootstrapClassList;

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
            firstName: this.form.privateCustomer.firstName.getValue(),
            lastName: this.form.privateCustomer.lastName.getValue(),
            companyName: this.form.companyCustomer.name.getValue()
        };
        return JSON.stringify(form);
    }
}
