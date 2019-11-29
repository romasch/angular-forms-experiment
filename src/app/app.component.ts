import {Component} from '@angular/core';
import {ControlledInput, ControlledInputImpl} from './controlled-input';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    form: NameForm = this.getFormElement();

    getFormElement(): NameForm {
        return new NameForm(
            new ControlledInputImpl<string>('hello ' + Math.random(), (firstName) => this.onFirstNameChange(firstName)),
            new ControlledInputImpl<string>('world ' + Math.random(), (lastName) => this.onLastNameChange(lastName)),
            new ControlledInputImpl<number>(42)
        );
    }

    private onFirstNameChange(name: string) {
        console.log('onFirstNameChange', name);
        setTimeout(() => this.form = this.getFormElement(), 3000);
    }

    private onLastNameChange(name: string) {
        console.log('onLastNameChange', name);
        setTimeout(() => this.form = this.getFormElement(), 1000);
    }

}


class NameForm {
    constructor(
        readonly firstName: ControlledInput<string>,
        readonly lastName: ControlledInput<string>,
        readonly age: ControlledInput<number>
    ) {
    }
}
