import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        
        if (source === null || source === undefined) {
            throw new IllegalArgumentException("Source string cannot be null or undefined");
        }
        
        this.name = source;
        this.noComponents = this.calculateNoComponents(source);
        this.assertClassInvariants();
    }

    protected createNewInstance(components: string[]): Name {
        const nameString = components.join(this.delimiter);
        return new StringName(nameString, this.delimiter);
    }

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

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i, false);
        
        const components = this.getComponentsArray();
        const result = components[i];
        
        if (result === null || result === undefined) {
            throw new MethodFailedException("getComponent returned null");
        }
        
        this.assertClassInvariants();
        return result;
    }

    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndex(i, false);
        this.assertIsValidComponent(c);
        
        const components = this.getComponentsArray();
        components[i] = c;
        
        const nameString = components.join(this.delimiter);
        const result = new StringName(nameString, this.delimiter);
        
        if (result.getComponent(i) !== c) {
            throw new MethodFailedException("setComponent failed to set component");
        }
        
        return result;
    }

    public insert(i: number, c: string): Name {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);
        
        const oldNoComponents = this.getNoComponents();
        
        const components = this.getComponentsArray();
        components.splice(i, 0, c);
        
        const nameString = components.join(this.delimiter);
        const result = new StringName(nameString, this.delimiter);
        
        if (result.getNoComponents() !== oldNoComponents + 1) {
            throw new MethodFailedException("insert did not increase number of components by 1");
        }
        if (result.getComponent(i) !== c) {
            throw new MethodFailedException("insert did not place component at correct position");
        }
        
        return result;
    }

    public append(c: string): Name {
        this.assertIsValidComponent(c);
        
        const oldNoComponents = this.getNoComponents();
        
        const components = this.getComponentsArray();
        components.push(c);
        
        const nameString = components.join(this.delimiter);
        const result = new StringName(nameString, this.delimiter);
        
        if (result.getNoComponents() !== oldNoComponents + 1) {
            throw new MethodFailedException("append did not increase number of components by 1");
        }
        if (result.getComponent(result.getNoComponents() - 1) !== c) {
            throw new MethodFailedException("append did not place component at end");
        }
        
        return result;
    }

    public remove(i: number): Name {
        this.assertIsValidIndex(i, false);
        
        const oldNoComponents = this.getNoComponents();
        
        const components = this.getComponentsArray();
        components.splice(i, 1);
        
        const nameString = components.join(this.delimiter);
        const result = new StringName(nameString, this.delimiter);
        
        if (result.getNoComponents() !== oldNoComponents - 1) {
            throw new MethodFailedException("remove did not decrease number of components by 1");
        }
        
        return result;
    }
}
