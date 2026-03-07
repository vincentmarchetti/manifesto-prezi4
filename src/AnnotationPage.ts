import {    Annotation, 
            IManifestoOptions, 
            JSONLDResource,
            ManifestResource,
            IResource,
            ResourceOps } from "./internal";

export class AnnotationPage extends ManifestResource {
  constructor(jsonld: IResource, options: IManifestoOptions) {
    super(jsonld, options);
  }

  
  
  get Items() : Annotation[] {
    try{
        const itemsProp : unknown = this.ResourceProperty("items");
        const resourceItems:IResource[] | null = ResourceOps.cast_to_array( itemsProp );
        
        if (resourceItems == null ){
            const msg = `invalid value`;
            throw new Error(msg);
        }
        return resourceItems.map( (item:IResource, index:number):Annotation => {
            try{
                const resource:JSONLDResource = JSONLDResource.Construct( item, this.options);
                if (!["Annotation"].includes( resource.ResourceType)) 
                    throw new Error("not Annotation");
                return resource as Annotation;
            }
            catch (error){
                const msg = 'map at element ${index} | ${error}';
                throw new Error(msg);
            }
        });
    }
    catch (error){
        const msg = `AnnotationPage.Items | ${error}`;
        throw new Error(msg);
    }
  }
}
