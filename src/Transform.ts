import { JSONLDResource,
         IResource } from "./internal";


export interface ITransform {
    AxesValues: Number[];
    isTransform : boolean;
}

abstract class TransformBase extends JSONLDResource {
  constructor(jsonld: IResource) {
    super(jsonld);
  }
  
  isTransform : boolean = true;
  
  AxesValuesBase( defaultValue: Number ){
    return ["x","y","z"].map( (axis:string):Number => {
        const raw = this.ResourceProperty(axis);
        if (raw == null) return defaultValue;
        const conv = Number(raw);
        if (conv == null){
            const msg = `${this.ResourceType}.AxesValues | axis ${axis} not a number`;
            throw new Error(msg);
        }
        return (conv as Number);
    });
  }
  
}
export class TranslateTransform extends TransformBase implements ITransform {
  constructor(jsonld: IResource) {
    super(jsonld);
  }
  
  isTranslateTransform = true;

  get AxesValues():Number[]{
    return this.AxesValuesBase(0.0);
  }
}

export class RotateTransform extends TransformBase implements ITransform {
  constructor(jsonld: IResource) {
    super(jsonld);
  }

  RotateTransform:boolean = true;

  get AxesValues():Number[]{
    return this.AxesValuesBase(0.0);
  }
}

export class ScaleTransform extends TransformBase implements ITransform {
  constructor(jsonld?: any) {
    super(jsonld);
  }
  
  isScaleTransform:boolean = true;
  
  get AxesValues():Number[]{
    return this.AxesValuesBase(0.0);
  }
}
