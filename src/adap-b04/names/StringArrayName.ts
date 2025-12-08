import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    // @methodtype initialization-method
    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        
        // Preconditions
        if (source === null || source === undefined) {
            throw new IllegalArgumentException("Source array cannot be null or undefined");
        }
        
        this.components = [...source];
        this.assertClassInvariants();
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        // Preconditions
        this.assertIsValidIndex(i, false);
        
        const result = this.components[i];
        
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
        
        this.components[i] = c;
        
        // Postconditions
        if (this.components[i] !== c) {
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
        
        this.components.splice(i, 0, c);
        
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
        
        this.components.push(c);
        
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
        
        this.components.splice(i, 1);
        
        // Postconditions
        if (this.getNoComponents() !== oldNoComponents - 1) {
            throw new MethodFailedException("remove did not decrease number of components by 1");
        }
        
        this.assertClassInvariants();
    }
}
