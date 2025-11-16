export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 */
export class Name {
    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    // @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        this.components = [...other];
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        return this.components.map(component => {
            let result = '';
            for (let i = 0; i < component.length; i++) {
                const char = component[i];
                if (char === ESCAPE_CHARACTER && i + 1 < component.length) {
                    result += component[i + 1];
                    i++;
                } else {
                    result += char;
                }
            }
            return result;
        }).join(delimiter);
    }

    // @methodtype conversion-method
    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components[i] = c;
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 0, c);
    }

    // @methodtype command-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 1);
    }
}
