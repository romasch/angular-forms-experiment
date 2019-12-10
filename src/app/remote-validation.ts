import {FormFieldState} from './controlled-input';
import {Observable} from 'rxjs';
import {isUndefined} from 'util';

export type ValidateRemotelyFunction = () => Observable<boolean>;
export type ReceiveValidationResultFunction = (result: boolean) => void;

export class RemoteValidation {

    constructor(
        private readonly key: string,
        private readonly formFields: Array<FormFieldState<unknown>>,
        private readonly remoteValidationFunction: ValidateRemotelyFunction,
        private readonly onResultReceived?: ReceiveValidationResultFunction
    ) {
        if (isUndefined(onResultReceived)) {
            this.onResultReceived = result => this.defaultSetResult(result);
        }

        this.formFields.forEach(field => field.subscribe(() => this.validate()));
    }

    validate() {
        this.formFields.forEach(field => field.getValidationResults().registerValidationInProgress(this.key));
        this.remoteValidationFunction().subscribe(this.onResultReceived);
    }

    private defaultSetResult(value: boolean) {
        this.formFields.forEach(field => field.getValidationResults().registerValidationResult(this.key, value));
    }
}
