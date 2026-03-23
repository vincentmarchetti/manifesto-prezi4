import { JSONLDResource,
         IResource } from "./internal.js";


export type AxesValues = [number,number,number];

export interface ITransform{
    Components : AxesValues;
};

abstract class TransformBase extends JSONLDResource {
  constructor(jsonld: IResource) {
    super(jsonld);
  }
  
  isTransform : boolean = true;
  
  ComponentsBase( defaultValue: number ): AxesValues {
    return ["x","y","z"].map( (axis:string):Number => {
        const raw = this.ResourceProperty(axis);
        if (raw == null) return defaultValue;
        const conv = Number(raw);
        if (conv == null){
            const msg = `${this.ResourceType}.AxesValues | axis ${axis} not a number`;
            throw new Error(msg);
        }
        return (conv as Number);
    }) as AxesValues;
  }
  
}
export class TranslateTransform extends TransformBase implements ITransform {
  constructor(jsonld: IResource) {
    super(jsonld);
  }
  
  isTranslateTransform = true;

  get Components(): AxesValues {
    return this.ComponentsBase(0.0);
  }
}

export class RotateTransform extends TransformBase implements ITransform {
  constructor(jsonld: IResource) {
    super(jsonld);
  }

  isRotateTransform:boolean = true;

  get Components(): AxesValues {
    return this.ComponentsBase(0.0);
  }

}

export class ScaleTransform extends TransformBase implements ITransform {
  constructor(jsonld?: any) {
    super(jsonld);
  }
  
  isScaleTransform:boolean = true;
  
  get Components(): AxesValues {
    return this.ComponentsBase(1.0);
  }

}
