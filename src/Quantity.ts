import {IResource}       from "./IResource.js"; 
import {JSONLDResource}  from "./JSONLDResource.js";

/*
Represents the Quantity class, listed in Resource Classes in
https://preview.iiif.io/api/prezi-4/presentation/4.0/properties/#resource-classes
and an example given in documentation on the Light intentity property

*/
export class Quantity extends JSONLDResource{
    constructor(jsonld: IResource) {
        super(jsonld);
    }

    readonly isQuantity:boolean = true;

    get QuantityValue():number {
        const prop:unknown = this.ResourceProperty("quantityValue");
        const retVal = Number(prop);
        if ( Number.isNaN(retVal) )
            throw new Error(`Quantity class: quantityValue property not a number: ${prop}`);
        return retVal as number;
    }
      
    get Unit():string {
        const prop:unknown = this.ResourceProperty("unit");
        if ( typeof prop  != 'string' )
            throw new Error(`Quantity class: unit  property not a string: ${prop}`);
        return prop as string;  
      }
}