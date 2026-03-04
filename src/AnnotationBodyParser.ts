import {
  AnnotationBody,
  IManifestoOptions,
  Light,
  Camera,
  IResource,
  ResourceOps
  
} from "./internal";

// Todo: Add these to @iiif/vocabulary
const LightTypes: string[] = [
  "AmbientLight",
  "DirectionalLight",
  "PointLight",
  "SpotLight",
];
const CameraTypes: string[] = ["PerspectiveCamera", "OrthographicCamera"];
const DisplayedTypes: string[] = [
  "Image",
  "Document",
  "Audio",
  "Model",
  "Video",
  "Canvas",
  "Sound",
  "Text"
];

export class AnnotationBodyParser {
  static BuildFromJson(jsonld: unknown , options?: IManifestoOptions): object {
  
    const res : IResource = ResourceOps.coerce_to_resource(jsonld);
    
    const BodyCtor = ((tp:string):any => {
        if (tp === "SpecificResource") return SpecificResource;
        if (tp === "Model" )           return Model;
        if (LightTypes.includes(type)) return Light;
        if (CameraTypes.includes(type)) return new Camera;
        const msg = `AnnotationBodyParser.BuildFromJson unrecognized type ${tp}`;
        throw new Error(msg);
    })(res.type);
    
    return new BodyCtor(res, options);     
  }
}
