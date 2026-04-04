import {IResource, ResourceOps}       from "./IResource.js"; 
import {JSONLDResource}  from "./JSONLDResource.js";
import {Color}           from "./Color.js";
import {Value}           from "./Value.js";


abstract class LightBase extends JSONLDResource {
  constructor(jsonld: IResource) {
    super(jsonld);
  }
  
  readonly isLight:boolean = true;
}
  
abstract class SimpleLightBase extends LightBase{
    constructor(jsonld: IResource) {
        super(jsonld);
    }
    
    get Color(): { red:number, green:number, blue:number }  {
        const cssTerm: unknown = this.ResourceProperty("color");
        
        try{
            if (typeof cssTerm == null)
                return {red:255, green:255, blue:255 };
                
            if (typeof cssTerm == 'string') 
                return Color.fromCSS(cssTerm);
            
            throw new Error(`color property not expected string ${cssTerm}`);
        } catch (error){
            const msg = `SimpleLightBase | ${error}`;
            throw new Error(msg);
        }
    }
    
    get Intensity():Value | null {
        const prop : unknown = this.ResourceProperty("intensity");
        if (prop == null) return null;
        
        try {
            const valueData : IResource | null = ResourceOps.cast_to_resource(prop);
            if (valueData == null)
                throw new Error(`property has invalid value`);
            const valueResource : JSONLDResource = JSONLDResource.Construct(valueData);
            if (!(valueResource as any).isValue)
                throw new Error(`property not a Value Resource`);
            return valueResource as Value;
        } catch(error){
            const msg = `SimpleLightBase.Intensity | ${error}`;
            throw new Error(msg);
        }
    }
}

abstract class AimedLightBase extends SimpleLightBase {
    constructor(jsonld: IResource) {
        super(jsonld);
    }

    get LookAt(): JSONLDResource | null {
        const prop : unknown = this.ResourceProperty("lookAt");
        if (prop == null) return null;
        
        try {
            const lookAtData : IResource | null = ResourceOps.cast_to_resource(prop);
            if (lookAtData == null)
                throw new Error(`lookAt property has invalid value`);
            const lookAtResource : JSONLDResource = JSONLDResource.Construct(lookAtData);
            return lookAtResource as JSONLDResource;
        } catch(error){
            const msg = `AimedLightBase.LookAt | ${error}`;
            throw new Error(msg);
        }    
    }
}

export class SpotLight extends AimedLightBase {
    constructor(jsonld: IResource) {
        super(jsonld);
    }

    readonly isSpotLight:boolean = true;
    
    /*
    angle property  is the "half - angle " of the cone emitted by the spotlight
    in degrees, as such it is limited by 0 to 90
    */
    get Angle():number | null {
        const prop:unknown = this.ResourceProperty("angle");
        const retVal:number = Number(prop);
        if ( Number.isNaN(retVal) )
            throw new Error(`SpotLight.Angle: value property not a number: ${prop}`);
        if (retVal <= 0.0 || retVal >= 90.0){
            const msg:string = `SpotLight.Angle | invalid angle value ${retVal}`;
            throw new Error(msg);
        }
        return retVal;
    }    
}
