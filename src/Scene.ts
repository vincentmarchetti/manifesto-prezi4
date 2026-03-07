import {
  AnnotationPage,
  IResource,
  ResourceOps,
  JSONLDResource,
  IManifestoOptions,
  ManifestResource,
  Color,
} from "./internal";
// @ts-ignore
import flattenDeep from "lodash/flattenDeep";

export class Scene extends ManifestResource {
  constructor(jsonld: IResource, options: IManifestoOptions) {
    super(jsonld, options);
  }


  get BackgroundColor(): Color | null {
    // regular expression intended to match strings like
    // "#FF00FF" -- interpreted as three hexadecimal values
    // in range 0-255 . Not that the \w escape matches digits,
    // upper and lower case latin characters, and underscore
    // currently only supports the form for CSS
    // https://www.w3.org/wiki/CSS/Properties/color/RGB
    // with 6 hexadecimal digits

    var bgc: string | undefined = this.getProperty("backgroundColor");
    if (bgc) return Color.fromCSS(bgc as string);
    else return null;
  }

  
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