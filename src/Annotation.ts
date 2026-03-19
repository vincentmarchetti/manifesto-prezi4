import { AnnotationMotivation } from "@iiif/vocabulary/dist-commonjs/index.js";
import { IManifestoOptions } from "./IManifestoOptions.js";
import { ManifestResource }  from "./ManifestResource.js";
import { JSONLDResource   }  from "./JSONLDResource.js";
import { IResource, ResourceOps} from "./IResource.js";

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

  
  get Motivation(): string[] {
    const prop:unknown = this.ResourceProperty("motivation");
    if (prop == null ) return ([] as string[]);
    if (typeof prop === 'string') return [prop];
    if (Array.isArray(prop)){
        return prop.map( (v:unknown, index:number):string => {
            if (typeof v === "string") return (v as string);
            const msg = `Annotation.Motivate | map | at index ${index} not a string`;
            throw new Error(msg);
        });
    }
    const msg:string = `Annotation.Motivate | argument type ${typeof prop} invalid`;
    throw new Error(msg);
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
