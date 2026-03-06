import {
  IManifestoOptions,
  Light,
  Camera,
  Model,
  SpecificResource,
  IResource,
  ManifestResource,
  ResourceOps  
} from "./internal";


const BodyCtorDict = {
    "Model"             : Model,
    "AmbientLight"      : Light,
    "DirectionalLight"  : Light,
    "PointLight"        : Light,
    "SpotLight"         : Light,
    "PerspectiveCamera" : Camera,
    "OrthgraphicCanera" : Camera,
    "SpecificResource"  : SpecificResource
};


export class AnnotationBodyParser {
  static BuildFromJson(jsonld: unknown , options?: IManifestoOptions): ManifestResource {
  
    const res  = ResourceOps.cast_to_resource(jsonld);
    if (res === null)
        throw new Error(`AnnotationBodyParser,BuildFromJson invalid value`);
        
    const BodyCtor = BodyCtorDict[(res as IResource).type];
    if (BodyCtor === undefined){
        const msg = `AnnotationBodyParser.BuildFromJson unrecognized type ${res.type}`;
        throw new Error(msg);
    }
    
    return new BodyCtor(res, options) as ManifestResource;     
  }
}
