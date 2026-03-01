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

    const objType : unknown = jsonld["type"];
    if ( typeof objType !== "string")
        throw new Error(`TransformParser.BuildFromJson invalid object type property ${objType}`);
    const objTypeString = objType as string;
    
    if (!Object.hasOwn(constructors, objTypeString)){
        throw new Error(`TransformParser.BuildFromJson: invalid jsonld type: ${objTypeString}`);
    }
    
    const func = constructors[objTypeString];
    return new func(jsonld) as Transform;
  }  
}
