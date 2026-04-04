import {IResource}       from "./IResource.js"; 
import (JSONLDResource)  from ".JSONLDResource.js";

/*
Represents the Value class, listed in Resource Classes in
https://preview.iiif.io/api/prezi-4/presentation/4.0/properties/#resource-classes
and an example given in documentation on the Light intentity property

*/
export class Value extends JSONLDResource{
    constructor(jsonld: IResource) {
        super(jsonld);
    }

get Value:number {
    const prop:unknown = this.ResourceProperty("value");
    const retVal = Number(prop);
    if ( retVal === NaN )
        throw new Error(`Value class: value property not a number: ${prop}`);
    return retVal as number;
}
  
get Units:string {
    const prop:unknown = this.ResourceProperty("units");
    if ( typeof prop  != 'string' )
        throw new Error(`Value class: units property not a string: ${prop}`);
    return retVal as string;  
  }
}