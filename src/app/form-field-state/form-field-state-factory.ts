import {FormFieldState, ValuePublishedSubscriber} from './form-field-state';
import {ValidationState} from '../validation/validation-state';
import {ImmediateValidation} from '../validation/immediate-validation';

export interface InitializationOptions<T> {
    initialValue: T;
    validations: Array<ImmediateValidation<T>>;
    onValuePublishedSubscribers: Array<ValuePublishedSubscriber<T>>;
}

export function textInput(options: Partial<InitializationOptions<string>> = {}): FormFieldState<string> {
    return createNewFactoryMethod<string>('')(options);
}

export function numberInput(options: Partial<InitializationOptions<number>> = {}): FormFieldState<number> {
    return createNewFactoryMethod<number>(NaN)(options);
}

export function createNewFactoryMethod<T>(initialInput: T): (options: Partial<InitializationOptions<T>>) => FormFieldState<T> {
    return options => {
        const defaults: InitializationOptions<T> = {
            initialValue: initialInput,
            validations: [],
            onValuePublishedSubscribers: []
        };
        const merged = Object.assign(defaults, options);
        return new FormFieldStateImpl(merged);
    };
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

    constructor(options: InitializationOptions<T>) {
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
