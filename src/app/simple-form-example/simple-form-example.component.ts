import {Component} from '@angular/core';
import {numberInput, textInput} from '../controlled-input';
import {toBootstrapClassList} from '../bootstrap-utils';
import {max, min, required} from '../validation/validators';

@Component({
    selector: 'app-simple-form-example',
    templateUrl: './simple-form-example.component.html',
    styleUrls: ['./simple-form-example.component.scss']
})
export class SimpleFormExampleComponent {

    toBootstrapClassList = toBootstrapClassList;

    form = {
        firstName: textInput({validations: [required()]}),
        lastName: textInput(),
        menus: numberInput({validations: [required(), min(1), max(100)]}),
    };

    submitted: string;

    submit(): boolean {
        this.submitted = this.getJson();
        return false; // TODO: This is still a bit ugly. Maybe it can be solved with another directive.
    }

    getJson(): string {
        const form = {
            firstName: this.form.firstName.getValue(),
            lastName: this.form.lastName.getValue(),
            menus: this.form.menus.getValue()
        };
        return JSON.stringify(form);
    }
}
