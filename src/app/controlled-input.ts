import {ValidationResults} from './validation-results';

export type ValuePublishedSubscriber<T> = (value: T, previousValue: T, latestFormValue: T) => void;

export type ImmediateValidationFunction<T> = (t: T) => boolean;

export class ImmediateValidation<T> {
    constructor(readonly key: string, readonly validate: ImmediateValidationFunction<T>) {
    }
}

// const isNotEmpty: ImmediateValidationFunction<any> = value => !isNullOrUndefined(value) && value !== '';
const isNotEmpty: ImmediateValidationFunction<any> = value => !!value;
export const required: ImmediateValidation<any> = new ImmediateValidation('ef.required', isNotEmpty);

export interface ControlledInput<T> {
    readonly value: T;
    readonly validationResults: ValidationResults;

    validate(value: T): void;

    subscribe(fn: ValuePublishedSubscriber<T>): void;

    publish(value: T, previousValue: T, latestFormValue: T): void;
}

export interface InputOptions<T> {
    initialValue: T;
    validations: Array<ImmediateValidation<T>>;
    onValuePublishedSubscribers: Array<ValuePublishedSubscriber<T>>;
}

export function textInput(options: Partial<InputOptions<string>> = {}): ControlledInput<string> {
    const defaults: InputOptions<string> = {
        initialValue: '',
        validations: [],
        onValuePublishedSubscribers: []
    };

    const merged = Object.assign(defaults, options);

    return new ControlledInputImpl(merged);
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

class ControlledInputImpl<T> implements ControlledInput<T> {

    value: T;
    readonly validationResults = new ValidationResults();
    private readonly validations: Array<ImmediateValidation<T>>;
    private readonly onValuePublishedSubscribers: Array<ValuePublishedSubscriber<T>>;

    constructor(options: InputOptions<T>) {
        this.value = options.initialValue;
        this.validations = options.validations;
        this.onValuePublishedSubscribers = options.onValuePublishedSubscribers;
    }

    subscribe(fn: ValuePublishedSubscriber<T>): void {
        this.onValuePublishedSubscribers.push(fn);
    }

    publish(value: T, previousValue: T, latestFormValue: T) {
        // TODO: Check if default write-back this makes sense in all cases.
        this.defaultOnValuePublished(value, previousValue, latestFormValue);
        this.onValuePublishedSubscribers.forEach(fn => fn(value, previousValue, latestFormValue));
    }

    validate(value: T): void {
        this.validations.forEach(validation => this.validationResults.registerValidationResult(validation.key, validation.validate(value)));
    }

    private defaultOnValuePublished(value: T, previousValue: T, latestFormValue: T): void {
        console.log('Published (value, previousValue, latestFormValue)', value, previousValue, latestFormValue);
        if (previousValue !== latestFormValue) {
            console.warn('CONFLICT');
        }
        this.value = value;
    }
}

export interface FormFieldState<T> {
    // Used by client
    setValue(value: T): void;

    getValue(): T;

    isConflict(): boolean;

    subscribe(fn: ValuePublishedSubscriber<T>): void;

    // Used by both:
    getValidationResults(): ValidationResults;

    // Used by directive:
    initialize(writeValueFunction: (value: T) => void): void;

    discardChanges(): void;

    registerFocus(): void; // focus event, saves previous value
    registerValueChanged(value: T): void; // trigger immediate validations
    registerValueCommitted(value: T): void; // commit the value, such that clients read it from getValue() (e.g. blur event, enter or tab pressed).
    registerBlur(): void; // emit a published value on blur().
}


class FormFieldStateImpl<T> implements FormFieldState<T> {

    private _isFocused = false;
    private _value: T;
    private _valueBeforeFocus: T;
    private _conflictingValue: T | undefined;
    private readonly _subscribers: Array<ValuePublishedSubscriber<T>> = [];
    private readonly _validationResults = new ValidationResults();
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

    subscribe(fn: ValuePublishedSubscriber<T>): void {
        this._subscribers.push(fn);
    }

    // Used by both:
    getValidationResults(): ValidationResults {
        return this._validationResults;
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
        this._immediateValidations.forEach(validation => this.getValidationResults()
            .registerValidationResult(validation.key, validation.validate(value)));
    }

    registerValueCommitted(value: T): void {
        this.registerValueChanged(value);
        this._value = value;
    }

    registerBlur(): void {
        if (!Object.is(this._value, this._valueBeforeFocus)) {
            this._subscribers.forEach(fn => fn(this._value, this._valueBeforeFocus, this._conflictingValue));
        }
        this._valueBeforeFocus = undefined;
        this._conflictingValue = undefined;
        this._isFocused = false;
    }

    private _writeValue: (value: T) => void = () => undefined;

}
