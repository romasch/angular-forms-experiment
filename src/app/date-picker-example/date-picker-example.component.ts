import {Component} from '@angular/core';
import {LocalDate} from '@js-joda/core';
import {dateField} from '../date-picker/date-picker.component';
import {ImmediateValidation} from '../validation/immediate-validation';
import {required} from '../validation/validators';

@Component({
    selector: 'app-date-picker-example',
    templateUrl: './date-picker-example.component.html',
    styleUrls: ['./date-picker-example.component.scss']
})
export class DatePickerExampleComponent {

    submitted: LocalDate;

    date = dateField({
        initialValue: LocalDate.now(),
        validations: [
            required(),
            new ImmediateValidation<LocalDate>('future.date', d => d && d.isAfter(LocalDate.now()))]
    });


    onSubmit() {
        this.submitted = this.date.getValue();
        return false;
    }
}
