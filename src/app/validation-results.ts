type ValidationResult = boolean | null;

export class ValidationResults {

    private readonly results: Map<string, ValidationResult> = new Map<string, ValidationResult>();

    /**
     * Check if all registered validations are successful and none are left in progress.
     * Note: This is NOT the inverse of isInvalid().
     */
    isValid(): boolean {
        return Array.from(this.results.values()).every(i => i === true);
    }

    /**
     * Check if any of the registered validations have failed.
     * Note: This is NOT the inverse of isValid().
     */
    isInvalid(): boolean {
        return Array.from(this.results.values()).some(i => i === false);
    }

    /**
     * Get the keys of all validations that have resulted in failure.
     */
    getValidationErrors(): string[] {
        return Array.from(this.results.entries())
            .filter(([key, value]) => value === false)
            .map(([key, value]) => key);
    }

    /**
     * Register a validation in progress.
     * This can be used for remote validations as an in-between state,
     * where the input field is not invalid but also not yet fully valid.
     */
    registerValidationInProgress(key: string) {
        this.results.set(key, null);
    }

    /**
     * Register a validation as either successful or failed.
     */
    registerValidationResult(key: string, result: boolean) {
        this.results.set(key, result);
    }
}
