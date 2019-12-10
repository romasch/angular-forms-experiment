import {isNullOrUndefined} from 'util';
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

export function numberInput(options: Partial<InputOptions<number>> = {}): ControlledInput<number> {
    const defaults: InputOptions<number> = {
        initialValue: NaN,
        validations: [],
        onValuePublishedSubscribers: []
    };

    const merged = Object.assign(defaults, options);

    return new ControlledInputImpl(merged);
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
