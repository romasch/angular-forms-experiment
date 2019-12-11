import {Component, Input} from '@angular/core';
import {FormFieldState} from '../form-field-state/form-field-state';
import {LocalDate} from '@js-joda/core';
import {createNewFactoryMethod, InitializationOptions, textInput} from '../form-field-state/form-field-state-factory';
import {ImmediateValidation} from '../validation/immediate-validation';
import {NgClassSet} from '../bootstrap-utils';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {

    date: FormFieldState<LocalDate>;
    text: FormFieldState<string> = textInput({
        validations: [new ImmediateValidation<string>('Date must be valid', s => stringToLocalDate(s) !== undefined)],
        onValuePublishedSubscribers: [v => this.forwardTextInput(v)]
    });

    @Input('state')
    set state(s: FormFieldState<LocalDate>) {
        this.date = s;
        s.initialize(date => this.text.setValue(localDateToString(date)));
    }

    getClass(): NgClassSet {
        return {
            'is-invalid': this.text.getValidationState().isInvalid() || this.date.getValidationState().isInvalid()
        };
    }

    forwardDateSelected(value: NgbDateStruct) {
        // TODO: This is a bit ugly. Also, maybe forward changed values?
        this.date.registerFocus();
        this.date.registerValueCommitted(ngbDateStructToLocalDate(value));
        this.date.registerBlur();
    }

    private forwardTextInput(value: string) {
        this.date.registerFocus();
        this.date.registerValueCommitted(stringToLocalDate(value));
        this.date.registerBlur();
    }

}


function stringToLocalDate(s: string): LocalDate {
    try {
        return LocalDate.parse(s);
    } catch (e) {
        console.warn('Date parse error: ', s);
        return undefined;
    }
}

export function ngbDateStructToLocalDate(ngbDate: NgbDateStruct): LocalDate {
    return LocalDate.of(ngbDate.year, ngbDate.month, ngbDate.day);
}

function localDateToString(d: LocalDate): string {
    return d.toString();
}

export function dateField(options: Partial<InitializationOptions<LocalDate>> = {}): FormFieldState<LocalDate> {
    return createNewFactoryMethod(LocalDate.of(2019, 12, 1))(options);
}
