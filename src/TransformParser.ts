import {
  Transform,
  TranslateTransform,
  RotateTransform,
  ScaleTransform,
} from "./internal";




export class TransformParser {
  static BuildFromJson(jsonld: object): Transform {
  
    const constructors = {
        "TranslateTransform" : TranslateTransform,
        "RotateTransform"    : RotateTransform,
        "ScaleTransform"     : ScaleTransform
    };

    const objType : any = jsonld["type"] ?? null;
    
    if (!Object.hasOwn(constructors, objType)){
        throw new Error(`TransformParser.BuildFromJson: invalid jsonld type: ${objType}`);
    }
    
    const func = constructors[objType];
    return new func(jsonld) as Transform;
  }  
}
