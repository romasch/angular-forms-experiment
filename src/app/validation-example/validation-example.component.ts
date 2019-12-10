import {Component} from '@angular/core';
import {FormFieldState, textInput} from '../controlled-input';
import {ValidationService} from './validation.service';
import {RemoteValidation} from '../validation/remote-validation';
import {required, validEmail} from '../validation/validators';
import {toBootstrapClassList} from '../bootstrap-utils';

const BLACKLIST_CUSTOMER = 'This customer is blacklisted.';
const EMAIL_ALREADY_DEFINED = 'Email is already defined in system.';

@Component({
    selector: 'app-validation-example',
    templateUrl: './validation-example.component.html',
    styleUrls: ['./validation-example.component.scss'],
    providers: [ValidationService]
})
export class ValidationExampleComponent {

    toBootstrapClassList = toBootstrapClassList;

    submitted: string;
    remoteValidations: RemoteValidation[];
    form = {
        firstName: textInput(),
        lastName: textInput({
            validations: [
                required().withKey('Last name must be provided!')
            ]
        }),
        email: textInput({
            validations: [
                required().withKey('Email must be provided!'),
                validEmail().withKey('This email is not valid!')
            ]
        })
    };

    constructor(private validationService: ValidationService) {
        this.remoteValidations = [
            new RemoteValidation(BLACKLIST_CUSTOMER,
                [this.form.firstName, this.form.lastName],
                () => this.validationService.validateValidCombination(this.form.firstName.getValue(), this.form.lastName.getValue())),
            new RemoteValidation(EMAIL_ALREADY_DEFINED,
                [this.form.email],
                () => this.validationService.validateUnique(this.form.email.getValue()))
        ];
    }

    submit(): boolean {
        if (isAllValid(this.form.firstName, this.form.lastName, this.form.email)) {
            // TODO: trigger backend validations as well...
            this.submitted = this.getJson();
        }
        return false;
    }

    getJson(): string {
        const form = {
            firstName: this.form.firstName.getValue(),
            lastName: this.form.lastName.getValue(),
            email: this.form.email.getValue()
        };
        return JSON.stringify(form);
    }
}

function isAllValid(...inputs: FormFieldState<unknown>[]) {
    inputs.forEach(i => i.registerValueChanged(i.getValue())); // TODO: client side API.
    return inputs.every(i => i.getValidationState().isValid());
}
