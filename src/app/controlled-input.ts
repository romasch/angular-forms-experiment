import {isNullOrUndefined} from 'util';
import {ValidationResults} from './validation-results';

export type ValuePublishedSubscriber<T> = (value: T, previousValue: T, latestFormValue: T) => void;

export type ValidationFunction<T> = (t: T) => boolean;

export class SimpleValidation<T> {
    constructor(readonly key: string, readonly validate: ValidationFunction<T>) {
    }
}

export const required: SimpleValidation<any> = new SimpleValidation('ef.required', value => !isNullOrUndefined(value) && value !== '');

export interface ControlledInput<T> {
    readonly value: T;
    readonly validationResults: ValidationResults;

    validate(value: T): void;

    publish(value: T, previousValue: T, latestFormValue: T): void;
}

export interface InputOptions<T> {
    initialValue: T;
    validations: Array<SimpleValidation<T>>;
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


class ControlledInputImpl<T> implements ControlledInput<T> {

    value: T;
    readonly validationResults = new ValidationResults();
    private readonly validations: Array<SimpleValidation<T>>;
    private readonly onValuePublishedSubscribers: Array<ValuePublishedSubscriber<T>>;

    constructor(options: InputOptions<T>) {
        this.value = options.initialValue;
        this.validations = options.validations;
        this.onValuePublishedSubscribers = options.onValuePublishedSubscribers;
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
