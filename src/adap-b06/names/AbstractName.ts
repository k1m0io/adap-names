import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsValidDelimiter(delimiter);
        this.delimiter = delimiter;
        this.assertClassInvariants();
    }

    protected assertIsValidDelimiter(delimiter: string): void {
        if (delimiter === null || delimiter === undefined) {
            throw new IllegalArgumentException("Delimiter cannot be null or undefined");
        }
        if (delimiter.length === 0) {
            throw new IllegalArgumentException("Delimiter cannot be empty");
        }
    }

    protected assertIsValidIndex(i: number, allowEnd: boolean = false): void {
        const maxIndex = allowEnd ? this.getNoComponents() : this.getNoComponents() - 1;
        if (i < 0 || i > maxIndex) {
            throw new IllegalArgumentException(`Index out of bounds: ${i}`);
        }
    }

    protected assertIsValidComponent(c: string): void {
        if (c === null || c === undefined) {
            throw new IllegalArgumentException("Component cannot be null or undefined");
        }
    }

    protected assertIsValidName(other: Name): void {
        if (other === null || other === undefined) {
            throw new IllegalArgumentException("Name cannot be null or undefined");
        }
    }

    protected assertClassInvariants(): void {
        const noComponents = this.getNoComponents();
        if (noComponents < 0) {
            throw new InvalidStateException("Number of components cannot be negative");
        }
    }

    public clone(): Name {
        return Object.create(this);
    }

    public asString(delimiter: string = this.delimiter): string {
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

        if (result === null || result === undefined) {
            throw new MethodFailedException("asString result is null");
        }
        
        this.assertClassInvariants();
        return result;
    }

    public asDataString(): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const result = components.join(DEFAULT_DELIMITER);
        
        if (result === null || result === undefined) {
            throw new MethodFailedException("asDataString result is null");
        }
        
        this.assertClassInvariants();
        return result;
    }

    public isEqual(other: Name): boolean {
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

    public isEmpty(): boolean {
        const result = this.getNoComponents() === 0;
        this.assertClassInvariants();
        return result;
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        return this.delimiter;
    }

    public concat(other: Name): Name {
        this.assertIsValidName(other);
        
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        
        const result = this.createNewInstance(components);
        
        if (result.getNoComponents() !== this.getNoComponents() + other.getNoComponents()) {
            throw new MethodFailedException("concat did not add correct number of components");
        }
        
        return result;
    }

    protected abstract createNewInstance(components: string[]): Name;

    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;
    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;
}
