import {ValidationState} from '../validation/validation-state';

export type ValuePublishedSubscriber<T> = (value: T, previousValue: T, latestFormValue: T) => void;

export interface FormFieldState<T> {
    // Used by client
    setValue(value: T): void;

    getValue(): T;


    isConflict(): boolean;

    isDirty(): boolean;

    isTouched(): boolean;

    subscribe(fn: ValuePublishedSubscriber<T>): void;

    // Used by both:
    getValidationState(): ValidationState;

    // Used by directive:
    initialize(writeValueFunction: (value: T) => void): void;

    discardChanges(): void;

    registerFocus(): void; // focus event, saves previous value
    registerValueChanged(value: T): void; // trigger immediate validations
    registerValueCommitted(value: T): void; // commit the value, such that clients read it from getValue() (e.g. blur event, enter or tab pressed).
    registerBlur(): void; // emit a published value on blur().
}
