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
  
  AxesValuesBase( defaultValue: Number[] ){
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
  
  isTransform:boolean = true;
  isTranslateTransform = true;

  get AxesValues():Number[] => this.AxesValueBase(1.0);
}

export class RotateTransform extends Transform {
  constructor(jsonld: IResource) {
    super(jsonld);
    this.
  }

  isTransform:boolean = true;
  RotateTransform:boolean = true;

  get AxesValues():Number[]{
    return ["x","y","z"].map( (axis:string):Number => {
        const raw = this.ResourceProperty(axis);
        if (raw == null) return 0.0;
        const conv = Number(raw);
        if (conv != null) return (conv as Number);
        const msg = `RotateTransform.AxesValues | axis ${axis} not a number`;
        throw new Error(msg);
    })
  }
}

export class ScaleTransform extends Transform {
  constructor(jsonld?: any) {
    super(jsonld);
    this.isScaleTransform = true;
  }
  isScaleTransform:boolean = true;
  get AxesValues():Number[]{
    return ["x","y","z"].map( (axis:string):Number => {
        const raw = this.ResourceProperty(axis);
        if (raw == null) return 1.0;
        const conv = Number(raw);
        if (conv != null) return (conv as Number);
        const msg = `ScaleTransform.AxesValues | axis ${axis} not a number`;
        throw new Error(msg);
    })
  }
}
