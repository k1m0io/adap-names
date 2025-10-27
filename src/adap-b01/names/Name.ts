export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

export interface Name {
    asString(delimiter?: string): string;
    asDataString(): string;
    getComponent(i: number): string;
    setComponent(i: number, c: string): void;
    getNoComponents(): number;
    insert(i: number, c: string): void;
    append(c: string): void;
    remove(i: number): void;
    getDelimiter(): string;
}

export class StringArrayName implements Name {
    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    // @methodtype constructor
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
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    // @methodtype command-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    // @methodtype get-method
    public getDelimiter(): string {
        return this.delimiter;
    }
}

export class StringName implements Name {
    private delimiter: string = DEFAULT_DELIMITER;
    private name: string = '';

    // @methodtype constructor
    constructor(other: string, delimiter?: string) {
        this.name = other;
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        const components = this.getComponentsArray();
        let result = '';
        for(let i = 0; i < components.length; i++) {
            const component = components[i];
            let unmasked = '';
            for (let j = 0; j < component.length; j++) {
                const char = component[j];
                if (char === ESCAPE_CHARACTER && j + 1 < component.length) {
                    unmasked += component[j + 1];
                    j++;
                } else {
                    unmasked += char;
                }
            }
            result += unmasked;
            if(i < components.length - 1) {
                result += delimiter;
            }
        }
        return result;
    }

    // @methodtype conversion-method
    public asDataString(): string {
        const components = this.getComponentsArray();
        return components.join(DEFAULT_DELIMITER);
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        const components = this.getComponentsArray();
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        const components = this.getComponentsArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    // @methodtype get-method
    public getNoComponents(): number {
        const arr = this.getComponentsArray();
        return arr.length;
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        const components = this.getComponentsArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
    }

    // @methodtype command-method
    public append(c: string): void {
        const components = this.getComponentsArray();
        components.push(c);
        this.name = components.join(this.delimiter);
    }

    // @methodtype command-method
    public remove(i: number): void {
        const components = this.getComponentsArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
    }

    // @methodtype get-method
    public getDelimiter(): string {
        return this.delimiter;
    }

    // @methodtype helper-method
    private getComponentsArray(): string[] {
        if (this.name === '') {
            return [];
        }
        const components: string[] = [];
        let current = '';
        let i = 0;
        while(i < this.name.length) {
            const char = this.name[i];
            if (char === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                current += char;
                current += this.name[i + 1];
                i += 2;
            } else if (char === this.delimiter) {
                components.push(current);
                current = '';
                i++;
            } else {
                current += char;
                i++;
            }
        }
        components.push(current);
        return components;
    }
}
