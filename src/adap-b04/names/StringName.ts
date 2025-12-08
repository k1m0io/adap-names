import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {
    protected name: string = "";
    protected noComponents: number = 0;

    // @methodtype initialization-method
    constructor(source: string, delimiter?: string) {
        super(delimiter);
        
        // Preconditions
        if (source === null || source === undefined) {
            throw new IllegalArgumentException("Source string cannot be null or undefined");
        }
        
        this.name = source;
        this.noComponents = this.calculateNoComponents(source);
        this.assertClassInvariants();
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
        // Preconditions
        this.assertIsValidIndex(i, false);
        
        const components = this.getComponentsArray();
        const result = components[i];
        
        // Postconditions
        if (result === null || result === undefined) {
            throw new MethodFailedException("getComponent returned null");
        }
        
        this.assertClassInvariants();
        return result;
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        // Preconditions
        this.assertIsValidIndex(i, false);
        this.assertIsValidComponent(c);
        
        const components = this.getComponentsArray();
        components[i] = c;
        this.setFromComponents(components);
        
        // Postconditions
        if (this.getComponent(i) !== c) {
            throw new MethodFailedException("setComponent failed to set component");
        }
        
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        // Preconditions
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);
        
        const oldNoComponents = this.getNoComponents();
        
        const components = this.getComponentsArray();
        components.splice(i, 0, c);
        this.setFromComponents(components);
        
        // Postconditions
        if (this.getNoComponents() !== oldNoComponents + 1) {
            throw new MethodFailedException("insert did not increase number of components by 1");
        }
        if (this.getComponent(i) !== c) {
            throw new MethodFailedException("insert did not place component at correct position");
        }
        
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public append(c: string): void {
        // Preconditions
        this.assertIsValidComponent(c);
        
        const oldNoComponents = this.getNoComponents();
        
        const components = this.getComponentsArray();
        components.push(c);
        this.setFromComponents(components);
        
        // Postconditions
        if (this.getNoComponents() !== oldNoComponents + 1) {
            throw new MethodFailedException("append did not increase number of components by 1");
        }
        if (this.getComponent(this.getNoComponents() - 1) !== c) {
            throw new MethodFailedException("append did not place component at end");
        }
        
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public remove(i: number): void {
        // Preconditions
        this.assertIsValidIndex(i, false);
        
        const oldNoComponents = this.getNoComponents();
        
        const components = this.getComponentsArray();
        components.splice(i, 1);
        this.setFromComponents(components);
        
        // Postconditions
        if (this.getNoComponents() !== oldNoComponents - 1) {
            throw new MethodFailedException("remove did not decrease number of components by 1");
        }
        
        this.assertClassInvariants();
    }
}
