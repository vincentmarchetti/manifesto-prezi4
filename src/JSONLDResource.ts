import {IResource} from "./IResource"; 
import {IManifestoOptions} from "./IManifestoOptions";

export class JSONLDResource {
  context: string;
  id: string;
  __jsonld: any;

  static ctors:any = null;
  static Construct(res:IResource, options? : IManifestoOptions):JSONLDResource{
    throw new Error(`JSONLDResource.Construct | not initialized`);
  }
  
  constructor(jsonld : IResource ) {
    this.__jsonld = jsonld;
    this.context = this.getProperty("context");
  }

  ResourceProperty(name:string):unknown {
    return this.__jsonld[name];
  }
  
  ResourceHasProperty( name: string ) : boolean {
    return Boolean( this.ResourceProperty(name) == null);
  }

  get ResourceType():string {
    return this.ResourceProperty("type") as string;
  }

  get ResourceId():string|null {
    const rv:unknown = this.ResourceProperty('id');
    if (rv == null) return null;
    if (typeof rv != "string"){
        const msg =`JSONLDResource.ResourceId | json id value not a string`;
        console.info(msg);
        return null;
    }
    return rv as string;
  }
  
  // @deprecated legacy function signature
    getProperty(name: string): any {
        let prop: any = null;
        
        if (this.__jsonld) {
            prop = this.__jsonld[name];
            
            if (!prop) {
            // property may have a prepended '@'
            prop = this.__jsonld["@" + name];
            }
            
        }
        return prop;
    }

/**
  A function that wraps the getProperty function, which client
  code can use if it is needed to identify when the json value of
  a property is an IRI -- Internationalized Resource Identifier
   
  If the value of the json value is a bare string, then it will be
  wrapped in a json object with the string in the property 'id', 
  additionally that property will have a property 'isIRI' which will
  be true for the literal string case, otherwise false meaning the
  returned getProperty should be parsed as before.
  
  **/
  getPropertyAsObject(name: string): any {
    let prop = this.getProperty(name);

    if (typeof prop === "string") return { id: prop, isIRI: true };
    else if (prop === Object(prop)) return prop;
    else  return null;
  }
}    