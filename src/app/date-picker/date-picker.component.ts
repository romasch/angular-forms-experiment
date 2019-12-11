import {Component, Input} from '@angular/core';
import {LocalDate} from '@js-joda/core';
import {InitializationOptions} from '../form-field-state/form-field-state-factory';
import {NgClassSet} from '../bootstrap-utils';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {createNewAdapterFactoryMethod, FormFieldStateAdapter} from '../form-field-state/form-field-state-adapter';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {

    @Input()
    state: FormFieldStateAdapter<LocalDate>;

    getClass(): NgClassSet {
        return {
            'is-invalid': this.state.getValidationState().isInvalid()
        };
    }

    forwardDateSelected(value: NgbDateStruct) {
        this.state.setValue(ngbDateStructToLocalDate(value));
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

function ngbDateStructToLocalDate(ngbDate: NgbDateStruct): LocalDate {
    return LocalDate.of(ngbDate.year, ngbDate.month, ngbDate.day);
}

function localDateToString(d: LocalDate): string {
    return d && d.toString();
}

export function dateField(options: Partial<InitializationOptions<LocalDate>> = {}): FormFieldStateAdapter<LocalDate> {
    return createNewAdapterFactoryMethod<LocalDate>(stringToLocalDate, localDateToString)(options);
}
