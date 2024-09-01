
export class ErrorHelper {
    static logError(message: string): void {
        console.error(`Error: ${message}`);
    }

    static handleError(error: Error): void {
        console.error(`An error occurred: ${error.message}`);
    }
}
