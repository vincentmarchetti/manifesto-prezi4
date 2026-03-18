
import { IResource, IManifestoOptions, ManifestResource } from "./internal.js";

 
/**
With the 3D extensions to the IIIF Presentation API the name of this
class is misleading, but for now is being retained for the sake backward
compatibility with earlier manifesto code and tests.

The 3D extensions allow that the body property of an annotation can be 
a light, camera, or model, or a SpecificResource object wrapping a light, camera,
or model.
**/
export class Model extends ManifestResource {
  constructor(jsonld: IResource , options?: IManifestoOptions) {
    super(jsonld, options);
  }


  // Format, Type, Width, and Height are the body properties supported
  // in the code that supports Presentation 3
  get Format(): string | null {
    const rv = this.ResourceProperty("format");
    if (rv == null) return null;
    if (typeof rv === 'string') return rv;
    const msg = `Model.Format | invalid type ${typeof rv}`;
    console.log(msg);
    return null;
  }

  /*
  getType(): ExternalResourceType | null {
    const type: string = this.getPropertyFromSelfOrSource("type");

    if (type) {
      return <ExternalResourceType>(
        Utils.normaliseType(type)
      );
    }

    return null;
  }
  */



  get isModel(): boolean {
    return true;
  }
  
  get isSpecificResource(): boolean {
    return false;
  }

}
