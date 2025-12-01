import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {
    protected name: string = "";
    protected noComponents: number = 0;

    // @methodtype initialization-method
    constructor(source: string, delimiter?: string) {
        super(delimiter);
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

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponentsArray();
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponentsArray();
        components[i] = c;
        this.setFromComponents(components);
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponentsArray();
        components.splice(i, 0, c);
        this.setFromComponents(components);
    }

    // @methodtype command-method
    public append(c: string): void {
        const components = this.getComponentsArray();
        components.push(c);
        this.setFromComponents(components);
    }

    // @methodtype command-method
    public remove(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds");
        }
        const components = this.getComponentsArray();
        components.splice(i, 1);
        this.setFromComponents(components);
    }
}
