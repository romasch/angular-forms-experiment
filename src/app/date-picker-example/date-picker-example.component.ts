import {Component} from '@angular/core';
import {FormFieldState} from '../form-field-state/form-field-state';
import {LocalDate} from '@js-joda/core';
import {dateField} from '../date-picker/date-picker.component';
import {ImmediateValidation} from '../validation/immediate-validation';

@Component({
    selector: 'app-date-picker-example',
    templateUrl: './date-picker-example.component.html',
    styleUrls: ['./date-picker-example.component.scss']
})
export class DatePickerExampleComponent {

    date: FormFieldState<LocalDate> = dateField({validations: [new ImmediateValidation<LocalDate>('future.date', d => d.isAfter(LocalDate.now()))]});


}
