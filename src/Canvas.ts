import {
  AnnotationPage,
  IResource,
  ResourceOps,
  JSONLDResource,
  IManifestoOptions,
  ManifestResource,
  Color,
} from "./internal.js";
// @ts-ignore

export class Canvas extends ManifestResource {
  constructor(jsonld: IResource, options: IManifestoOptions) {
    super(jsonld, options);
  }

  isCanvas : boolean = true;


  
  get Items() : AnnotationPage[] {
    try{
        const itemsProp : unknown = this.ResourceProperty("items");
        const resourceItems:IResource[] | null = ResourceOps.cast_to_array( itemsProp );
        
        if (resourceItems == null ){
            const msg = `Scene.Items | invalid value`;
            throw new Error(msg);
        }
        return resourceItems.map( (item:IResource, index:number):AnnotationPage => {
            try{
                const resource:JSONLDResource = JSONLDResource.Construct( item, this.options);
                if (!["AnnotationPage"].includes( resource.ResourceType)) 
                    throw new Error("not AnnotationPage");
                return resource as AnnotationPage;
            }
            catch (error){
                const msg = 'map at element ${index} | ${error}';
                throw new Error(msg);
            }
        });
    }
    catch (error){
        const msg = `Scene.Items | ${error}`;
        throw new Error(msg);
    }
  }
}   