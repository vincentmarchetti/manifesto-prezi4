import { AnnotationMotivation } from "@iiif/vocabulary/dist-commonjs";
import {
  IManifestoOptions,
  ManifestResource,
  JSONLDResource,
  IResource,
  ResourceOps,
} from "./internal";

export class Annotation extends ManifestResource {
  constructor(jsonld: IResource, options: IManifestoOptions) {
    super(jsonld, options);
  }

  isAnnotation:boolean = true;
  
  /**
  In spite of its name, this method returns an array of objects, each of which
  represents a potential body annotations
  
  @see{ https://iiif.io/api/cookbook/recipe/0033-choice/ }
  **/
  get Body(): JSONLDResource  {
    try{
        const bodyres:IResource=( ():IResource => {
            if (this.ResourceHasProperty("bodyValue")){
                const textValue:unknown = this.ResourceProperty("bodyValue");
                if (typeof textValue === 'string'){
                    return {
                        "value" : textValue,
                        "type"  : "TextualBody"
                    } as IResource;
                }
                const msg = `bodyValue property with typeof ${typeof textValue}`;
                throw new Error(msg);
            }
            const bodyData:unknown = this.ResourceProperty("body");
            if (bodyData == null ) throw new Error(`body property is null`);
            if (typeof bodyData === 'string') throw new Error(`body property bare string`);
            const retVal:IResource | null = ResourceOps.cast_to_resource( bodyData );
            if (retVal == null) throw new Error("invalid body property value");
            return retVal as IResource;
        })();
        return JSONLDResource.Construct(bodyres, this.options);
    }
    catch(error){
        const msg = `Annotation.Body | ${error}`;
        throw new Error(msg);
    }    
  }

  
  getMotivation(): AnnotationMotivation | null {
    const motivation: string = this.getProperty("motivation");

    if (motivation) {
      //const key: string | undefined = Object.keys(AnnotationMotivationEnum).find(k => AnnotationMotivationEnum[k] === motivation);
      return motivation as AnnotationMotivation;
    }

    return null;
  }


  get Target(): any {
     try{
        const targetres:IResource=( ():IResource => {
            
            const targetData:unknown = this.ResourceProperty("target");
            if (targetData == null ) throw new Error(`target property is null`);
            if (typeof targetData === 'string') throw new Error(`targetData property bare string`);
            const retVal:IResource | null = ResourceOps.cast_to_resource( targetData );
            if (retVal == null) throw new Error("invalid target property value");
            return retVal as IResource;
        })();
        return JSONLDResource.Construct(targetres, this.options);
    }
    catch(error){
        const msg = `Annotation.Body | ${error}`;
        throw new Error(msg);
    }    
  }

  get ScopeContent(): Annotation[] {
    throw new Error(`Annotation.ScopeContent | not implemented`);
  }
    /*
    const items = this.getTarget()?.getScope()?.getTarget()?.items;
    if (!items) return [];

    return items
      .filter((item) => item && item.type === "AnnotationPage")
      .map((item) => new AnnotationPage(item, this.options).getItems())
      .flat()
      .filter((item) => item && item.type === "Annotation")
      .map((annotation) => new Annotation(annotation, this.options));
  }

  get ScopeContent() {
    return this.getScopeContent();
  }
*/
}
