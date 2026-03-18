import {
  IManifestoOptions,
  JSONLDResource,
  IResource,
  ResourceOps,
  ITransform
} from "./internal.js";

/**
    Developer note: This implementation does not strictly adhere
    to the description of SpecificResource in the Web Annotation Model
    document https://www.w3.org/TR/annotation-model/
    section 4 : https://www.w3.org/TR/annotation-model/#specific-resources
    
    The getTransform() method returning an Array of 3D Transfom resources, is
    an extension of SpecificResource beyond the web annotation model.
*/
export class SpecificResource extends JSONLDResource {
  /*
  property distinguishing instances of SpecificResource from instances of AnnotionBody.
  The return type of the Annotation.getBody() method is an array of instances of the 
  union type ( AnnotationBody | SpecificResource )
  */
  isAnnotationBody: boolean = false;

  /*
  property distinguishing instances of SpecificResource from instances of AnnotionBody.
  The return type of the Annotation.getBody() method is an array of instances of the 
  union type ( AnnotationBody | SpecificResource )
  */
  isSpecificResource: boolean = true;

  options : IManifestoOptions | null;
  
  constructor(jsonld: IResource, options?: IManifestoOptions | null) {    
    super(jsonld);
    this.options = options ?? null; // saving to use to pass on to the Source object
  }


  get Scope(): JSONLDResource | null {
    throw new Error(`SpecificResource.Scope | unimplemented`);
  }



  get Source(): JSONLDResource {
    
    const res: unknown = this.ResourceProperty("source");
    if (res == null)
        throw new Error(`SpecificResource.Source | null value`);
    if (typeof res == 'string')
        throw new Error(`SpecificResource.Source | string value`);
    const ires: IResource | null = ResourceOps.cast_to_resource(res);
    if ( ires == null){
        const msg = `SpecificResource.Source | unsupport json value ${typeof res}`;
        throw new Error(msg);
    }
    try{
        return JSONLDResource.Construct(ires, this.options ?? undefined );
    }
    catch (error ){
        const msg: string = `SpecificResource.Source | unsupported resource type ${ires.type}`;
        throw new Error(msg);
    }
  }

  get Selector(): JSONLDResource | null {
    
    const res: unknown = this.ResourceProperty("selector");
    if (res == null) return null;

    const ires: IResource | null = ResourceOps.cast_to_resource(res);
    if ( ires == null){
        const msg = `SpecificResource.Selector | unsupport json value ${typeof res}`;
        throw new Error(msg);
    }
    try{
        return JSONLDResource.Construct(ires, this.options ?? undefined );
    }
    catch (error ){
        const msg: string = `SpecificResource.Selector | unsupported resource type ${ires.type}`;
        throw new Error(msg);
    }
  }
  

  
  get Transform(): ITransform[] {
    
    const transformItems : IResource[] | null = ResourceOps.cast_to_array(this.ResourceProperty("transform"));
    if (transformItems  == null){
        const msg = `SpecificResource.Transform | cannot parse "transform" property`;
        throw new Error(msg);
    }
    
    return transformItems.map( (transformItem:IResource, index:number ):ITransform => {
    
        try{
            const tmp = JSONLDResource.Construct(transformItem ) as any;
            if (!tmp.isTransform) throw new Error(`not a ITransform instance`);
            return (tmp as ITransform);
        }
        catch (error){
            const msg = 'SpecificResource.Transform | map | invalid element at index ${index} : ${error}';
            throw new Error(msg);
        }
    });
  }



}
