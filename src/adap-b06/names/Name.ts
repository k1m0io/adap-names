import { Equality } from "../common/Equality";

export interface Name extends Equality {
    getDelimiterCharacter(): string;
    getNoComponents(): number;
    getComponent(i: number): string;
    isEmpty(): boolean;
    
    setComponent(i: number, c: string): Name;
    insert(i: number, c: string): Name;
    append(c: string): Name;
    remove(i: number): Name;
    concat(other: Name): Name;
    
    asString(delimiter?: string): string;
    asDataString(): string;
    
    isEqual(other: Name): boolean;
    getHashCode(): number;
    
    clone(): Name;
}
