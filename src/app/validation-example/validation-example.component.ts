import {Component} from '@angular/core';
import {ControlledInput, ControlledInputImpl, SimpleValidation} from '../controlled-input';
import {ValidationService} from './validation.service';

@Component({
    selector: 'app-validation-example',
    templateUrl: './validation-example.component.html',
    styleUrls: ['./validation-example.component.scss'],
    providers: [ValidationService]
})
export class ValidationExampleComponent {

    submitted: string;

    private readonly required = new SimpleValidation<string>('This value is required.', val => this.validationService.validateRequired(val));
    private readonly validEmail = new SimpleValidation<string>('Must be a valid email', val => this.validationService.validateEmail(val));

    form = {
        firstName: new ControlledInputImpl<string>('', value => this.onFirstNameChange(value)),
        lastName: new ControlledInputImpl<string>('', value => this.onLastNameChange(value), [this.required]),
        email: new ControlledInputImpl<string>('', value => this.onEmailChange(value), [this.required, this.validEmail])
    };

    constructor(private validationService: ValidationService) {
    }

    submit(): boolean {
        if (isAllValid(this.form.firstName, this.form.lastName, this.form.email)) {
            this.submitted = this.getJson();
        }
        return false;
    }

    getJson(): string {
        const form = {
            firstName: this.form.firstName.value,
            lastName: this.form.lastName.value,
            email: this.form.email.value
        };
        return JSON.stringify(form);
    }

    getFirstNameValidationError(): string {
        return undefined;
    }

    getLastNameValidationError(): string {
        return undefined;
    }

    getEmailValidationError() {
        return undefined;
    }

    private onFirstNameChange(value: string) {
        this.form.firstName.value = value;
        this.validationService.validateValidCombination(value, this.form.lastName.value)
            .subscribe(valid => {
                this.form.firstName.setValidationError('Roman Schmocker is not allowed.', valid);
                this.form.lastName.setValidationError('Roman Schmocker is not allowed.', valid);
            });
    }

    private onLastNameChange(value: string) {
        this.form.lastName.value = value;
        this.validationService.validateValidCombination(this.form.firstName.value, this.form.lastName.value)
            .subscribe(valid => {
                this.form.firstName.setValidationError('Roman Schmocker is not allowed.', valid);
                this.form.lastName.setValidationError('Roman Schmocker is not allowed.', valid);
            });
    }

    private onEmailChange(value: string) {
        this.form.email.value = value;
        this.validationService.validateUnique(this.form.email.value)
            .subscribe(valid => {
                this.form.email.setValidationError('Email is already present in system.', valid);
            });
    }
}

function isAllValid(...inputs: ControlledInput<any>[]) {
    return inputs.every(i => i.isValid());
}
