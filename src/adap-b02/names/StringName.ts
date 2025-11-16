import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    // @methodtype initialization-method
    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.name = source;
        this.noComponents = this.calculateNoComponents(source);
    }

    // @methodtype helper-method
    private calculateNoComponents(str: string): number {
        if (str === '') {
            return 1;
        }
        
        let count = 1;
        let i = 0;
        while (i < str.length) {
            const char = str[i];
            if (char === ESCAPE_CHARACTER && i + 1 < str.length) {
                i += 2;
            } else if (char === this.delimiter) {
                count++;
                i++;
            } else {
                i++;
            }
        }
        return count;
    }

    // @methodtype helper-method
    private getComponentsArray(): string[] {
        if (this.noComponents === 0) {
            return [];
        }
        
        if (this.name === '' && this.noComponents === 1) {
            return [''];
        }

        const components: string[] = [];
        let current = '';
        let i = 0;
        
        while (i < this.name.length) {
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

    // @methodtype helper-method
    private setFromComponents(components: string[]): void {
        if (components.length === 0) {
            this.name = '';
            this.noComponents = 0;
        } else {
            this.name = components.join(this.delimiter);
            this.noComponents = components.length;
        }
    }

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        const components = this.getComponentsArray();
        return components.map(component => {
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
        const components = this.getComponentsArray();
        return components.join(DEFAULT_DELIMITER);
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // @methodtype boolean-query-method
    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(x: number): string {
        if (x < 0 || x >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponentsArray();
        return components[x];
    }

    // @methodtype set-method
    public setComponent(n: number, c: string): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponentsArray();
        components[n] = c;
        this.setFromComponents(components);
    }

    // @methodtype command-method
    public insert(n: number, c: string): void {
        if (n < 0 || n > this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponentsArray();
        components.splice(n, 0, c);
        this.setFromComponents(components);
    }

    // @methodtype command-method
    public append(c: string): void {
        const components = this.getComponentsArray();
        components.push(c);
        this.setFromComponents(components);
    }

    // @methodtype command-method
    public remove(n: number): void {
        if (n < 0 || n >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponentsArray();
        components.splice(n, 1);
        this.setFromComponents(components);
    }

    // @methodtype command-method
    public concat(other: Name): void {
        const components = this.getComponentsArray();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.setFromComponents(components);
    }
}
