import {ValidationState} from './validation/validation-state';
import {ImmediateValidation} from './validation/immediate-validation';

export type ValuePublishedSubscriber<T> = (value: T, previousValue: T, latestFormValue: T) => void;

export interface InputOptions<T> {
    initialValue: T;
    validations: Array<ImmediateValidation<T>>;
    onValuePublishedSubscribers: Array<ValuePublishedSubscriber<T>>;
}

export function textInput(options: Partial<InputOptions<string>> = {}): FormFieldState<string> {
    const defaults: InputOptions<string> = {
        initialValue: '',
        validations: [],
        onValuePublishedSubscribers: []
    };

    const merged = Object.assign(defaults, options);

    return new FormFieldStateImpl(merged);
}

export function numberInput(options: Partial<InputOptions<number>> = {}): FormFieldState<number> {
    const defaults: InputOptions<number> = {
        initialValue: NaN,
        validations: [],
        onValuePublishedSubscribers: []
    };

    const merged = Object.assign(defaults, options);

    return new FormFieldStateImpl(merged);
}

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


class FormFieldStateImpl<T> implements FormFieldState<T> {

    private _dirty: boolean = false;
    private _touched: boolean = false;

    private _isFocused = false;
    private _value: T;
    private _valueBeforeFocus: T;
    private _conflictingValue: T | undefined;
    private readonly _subscribers: Array<ValuePublishedSubscriber<T>> = [];
    private readonly _validationState = new ValidationState();
    private readonly _immediateValidations: Array<ImmediateValidation<T>>;

    constructor(options: InputOptions<T>) {
        this._value = options.initialValue;
        this._immediateValidations = options.validations;
        options.onValuePublishedSubscribers.forEach(fn => this._subscribers.push(fn));
    }

    /**
     * Used by client
     */
    setValue(value: T): void {
        if (this._isFocused) {
            if (!Object.is(this._valueBeforeFocus, value)) {
                this._conflictingValue = value;
            }
        } else {
            this._value = value;
            this._writeValue(value);
        }
    }

    getValue() {
        return this._value;
    }

    isConflict() {
        return this._conflictingValue !== undefined;
    }

    isDirty(): boolean {
        return this._dirty;
    }

    isTouched(): boolean {
        return this._touched;
    }

    subscribe(fn: ValuePublishedSubscriber<T>): void {
        this._subscribers.push(fn);
    }

    // Used by both:
    getValidationState(): ValidationState {
        return this._validationState;
    }

    // Used by directive:
    initialize(writeValueFunction: (value: T) => void) {
        this._writeValue = writeValueFunction;
        this._writeValue(this._value);
    }

    discardChanges(): void {
        this._value = this._conflictingValue || this._valueBeforeFocus;
        this._writeValue(this._value);
    }

    registerFocus(): void {
        // focus event, saves previous value
        this._isFocused = true;
        this._valueBeforeFocus = this._value;
        this._conflictingValue = undefined;
    }

    registerValueChanged(value: T): void {
        this._touched = true;
        this._immediateValidations.forEach(validation => this.getValidationState()
            .registerValidationResult(validation.key, validation.validate(value)));
    }

    registerValueCommitted(value: T): void {
        this.registerValueChanged(value);
        this._value = value;
    }

    registerBlur(): void {
        if (!Object.is(this._value, this._valueBeforeFocus)) {
            this._subscribers.forEach(fn => fn(this._value, this._valueBeforeFocus, this._conflictingValue));
            this._dirty = true;
        }
        this._valueBeforeFocus = undefined;
        this._conflictingValue = undefined;
        this._isFocused = false;
    }

    private _writeValue: (value: T) => void = () => undefined;

}
