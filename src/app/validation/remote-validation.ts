import {Observable} from 'rxjs';
import {isUndefined} from 'util';
import {FormFieldState} from '../form-field-state/form-field-state';

export type RemoteValidator = () => Observable<boolean>;
export type ReceiveValidationResultFunction = (result: boolean) => void;

export class RemoteValidation {

    constructor(
        private readonly key: string,
        private readonly formFields: Array<FormFieldState<unknown>>,
        private readonly remoteValidationFunction: RemoteValidator,
        private readonly onResultReceived?: ReceiveValidationResultFunction
    ) {
        if (isUndefined(onResultReceived)) {
            this.onResultReceived = result => this.defaultSetResult(result);
        }

        this.formFields.forEach(field => field.subscribe(() => this.validate()));
    }

    validate() {
        this.formFields.forEach(field => field.getValidationState().registerValidationInProgress(this.key));
        this.remoteValidationFunction().subscribe(this.onResultReceived);
    }

    private defaultSetResult(value: boolean) {
        this.formFields.forEach(field => field.getValidationState().registerValidationResult(this.key, value));
    }
}
