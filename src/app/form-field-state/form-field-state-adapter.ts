import {FormFieldState} from './form-field-state';
import {ValidationState} from '../validation/validation-state';
import {InitializationOptions, textInput} from './form-field-state-factory';
import {ImmediateValidation} from '../validation/immediate-validation';

export interface FormFieldStateAdapter<T> extends FormFieldState<T> {
    getAdaptee(): FormFieldState<string>;
}

export function createNewAdapterFactoryMethod<T>(fromString: (str: string) => T,
                                                 toString: (t: T) => string):
    (options: Partial<InitializationOptions<T>>) => FormFieldStateAdapter<T> {
    return options => {
        const validations = (options.validations || [])
            .map(v => new ImmediateValidation<string>(v.key, str => v.validate(fromString(str))));
        const adaptee = textInput({initialValue: toString(options.initialValue), validations: validations});

        const adapter = new FormFieldStateAdapterImpl(adaptee, fromString, toString);
        (options.onValuePublishedSubscribers || []).forEach(sub => adapter.subscribe(sub));
        return adapter;
    };
}

class FormFieldStateAdapterImpl<T> implements FormFieldStateAdapter<T> {

    constructor(private adaptee: FormFieldState<string>,
                private convertFromString: (str: string) => T,
                private convertToString: (val: T) => string
    ) {
    }

    discardChanges(): void {
        this.getAdaptee().discardChanges();
    }

    getAdaptee(): FormFieldState<string> {
        return this.adaptee;
    }

    getValidationState(): ValidationState {
        return this.getAdaptee().getValidationState();
    }

    getValue(): T {
        return this.convertFromString(this.getAdaptee().getValue());
    }

    initialize(writeValueFunction: (value: T) => void): void {
        throw new Error('Should not be necessary');
    }

    isConflict(): boolean {
        return this.getAdaptee().isConflict();
    }

    isDirty(): boolean {
        return this.getAdaptee().isDirty();
    }

    isTouched(): boolean {
        return this.getAdaptee().isTouched();
    }

    registerBlur(): void {
        this.getAdaptee().registerBlur();
    }

    registerFocus(): void {
        this.getAdaptee().registerFocus();
    }

    registerValueChanged(value: T): void {
        this.getAdaptee().registerValueChanged(this.convertToString(value));
    }

    registerValueCommitted(value: T): void {
        this.getAdaptee().registerValueCommitted(this.convertToString(value));
    }

    setValue(value: T): void {
        this.getAdaptee().setValue(this.convertToString(value));
    }

    subscribe(fn: (value: T, previousValue: T, latestFormValue: T) => void): void {
        this.getAdaptee().subscribe((a, b, c) => fn(this.convertFromString(a), this.convertFromString(b), this.convertFromString(c)));
    }

}
