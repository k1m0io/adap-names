import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        
        if (source === null || source === undefined) {
            throw new IllegalArgumentException("Source array cannot be null or undefined");
        }
        
        this.components = [...source];
        this.assertClassInvariants();
    }

    protected createNewInstance(components: string[]): Name {
        return new StringArrayName(components, this.delimiter);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i, false);
        
        const result = this.components[i];
        
        if (result === null || result === undefined) {
            throw new MethodFailedException("getComponent returned null");
        }
        
        this.assertClassInvariants();
        return result;
    }

    public setComponent(i: number, c: string): Name {
        this.assertIsValidIndex(i, false);
        this.assertIsValidComponent(c);
        
        const newComponents = [...this.components];
        newComponents[i] = c;
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
        if (result.getComponent(i) !== c) {
            throw new MethodFailedException("setComponent failed to set component");
        }
        
        return result;
    }

    public insert(i: number, c: string): Name {
        this.assertIsValidIndex(i, true);
        this.assertIsValidComponent(c);
        
        const oldNoComponents = this.getNoComponents();
        
        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
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
        
        const newComponents = [...this.components, c];
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
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
        
        const newComponents = [...this.components];
        newComponents.splice(i, 1);
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
        if (result.getNoComponents() !== oldNoComponents - 1) {
            throw new MethodFailedException("remove did not decrease number of components by 1");
        }
        
        return result;
    }
}
