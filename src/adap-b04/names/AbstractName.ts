import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;

    // @methodtype initialization-method
    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsValidDelimiter(delimiter);
        this.delimiter = delimiter;
        this.assertClassInvariants();
    }

    // @methodtype assertion-method
    protected assertIsValidDelimiter(delimiter: string): void {
        if (delimiter === null || delimiter === undefined) {
            throw new IllegalArgumentException("Delimiter cannot be null or undefined");
        }
        if (delimiter.length === 0) {
            throw new IllegalArgumentException("Delimiter cannot be empty");
        }
    }

    // @methodtype assertion-method
    protected assertIsValidIndex(i: number, allowEnd: boolean = false): void {
        const maxIndex = allowEnd ? this.getNoComponents() : this.getNoComponents() - 1;
        if (i < 0 || i > maxIndex) {
            throw new IllegalArgumentException(`Index out of bounds: ${i}`);
        }
    }

    // @methodtype assertion-method
    protected assertIsValidComponent(c: string): void {
        if (c === null || c === undefined) {
            throw new IllegalArgumentException("Component cannot be null or undefined");
        }
    }

    // @methodtype assertion-method
    protected assertIsValidName(other: Name): void {
        if (other === null || other === undefined) {
            throw new IllegalArgumentException("Name cannot be null or undefined");
        }
    }

    // @methodtype assertion-method
    protected assertClassInvariants(): void {
        const noComponents = this.getNoComponents();
        if (noComponents < 0) {
            throw new InvalidStateException("Number of components cannot be negative");
        }
    }

    // @methodtype factory-method
    public clone(): Name {
        return Object.create(this);
    }

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        // Preconditions
        this.assertIsValidDelimiter(delimiter);
        
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        
        const result = components.map(component => {
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
            return unmasked;
        }).join(delimiter);

        // Postconditions
        MethodFailedException.assertCondition(result !== null && result !== undefined, "asString result is null");
        
        this.assertClassInvariants();
        return result;
    }

    // @methodtype conversion-method
    public toString(): string {
        return this.asDataString();
    }

    // @methodtype conversion-method
    public asDataString(): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const result = components.join(DEFAULT_DELIMITER);
        
        // Postconditions
        MethodFailedException.assertCondition(result !== null && result !== undefined, "asDataString result is null");
        
        this.assertClassInvariants();
        return result;
    }

    // @methodtype boolean-query-method
    public isEqual(other: Name): boolean {
        // Preconditions
        this.assertIsValidName(other);
        
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        
        this.assertClassInvariants();
        return true;
    }

    // @methodtype get-method
    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        
        this.assertClassInvariants();
        return hashCode;
    }

    // @methodtype boolean-query-method
    public isEmpty(): boolean {
        const result = this.getNoComponents() === 0;
        this.assertClassInvariants();
        return result;
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        return this.delimiter;
    }

    // @methodtype command-method
    public concat(other: Name): void {
        // Preconditions
        this.assertIsValidName(other);
        
        const oldNoComponents = this.getNoComponents();
        const otherNoComponents = other.getNoComponents();
        
        for (let i = 0; i < otherNoComponents; i++) {
            this.append(other.getComponent(i));
        }
        
        // Postconditions
        MethodFailedException.assertCondition(
            this.getNoComponents() === oldNoComponents + otherNoComponents,
            "concat did not add correct number of components"
        );
        
        this.assertClassInvariants();
    }

    // NARROW INHERITANCE INTERFACE
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;
    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}
