import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TextInputDirective} from './text-input.directive';
import {NumberInputDirective} from './number-input.directive';
import {SimpleFormExampleComponent} from './simple-form-example/simple-form-example.component';
import {ConditionalFormExampleComponent} from './conditional-form-example/conditional-form-example.component';
import {BackendFormExampleComponent} from './backend-form-example/backend-form-example.component';
import {ValidationExampleComponent} from './validation-example/validation-example.component';
import {NgbDatepickerModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {DatePickerComponent} from './date-picker/date-picker.component';
import {DatePickerExampleComponent} from './date-picker-example/date-picker-example.component';

@NgModule({
    declarations: [
        AppComponent,
        TextInputDirective,
        NumberInputDirective,
        SimpleFormExampleComponent,
        ConditionalFormExampleComponent,
        BackendFormExampleComponent,
        ValidationExampleComponent,
        DatePickerComponent,
        DatePickerExampleComponent
    ],
    imports: [
        BrowserModule, NgbTypeaheadModule, NgbDatepickerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
