import {
  IManifestoOptions,
  ManifestResource,
  Annotation,
  AnnotationBody,
  AnnotationBodyParser,
  Transform,
  TransformParser,
  PointSelector,
} from "./internal";

/**
    Developer note: This implementation does not strictly adhere
    to the description of SpecificResource in the Web Annotation Model
    document https://www.w3.org/TR/annotation-model/
    section 4 : https://www.w3.org/TR/annotation-model/#specific-resources
    
    The getTransform() method returning an Array of 3D Transfom resources, is
    an extension of SpecificResource beyond the web annotation model.
*/
export class SpecificResource extends ManifestResource {
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

  constructor(jsonld: any, options?: IManifestoOptions) {
    super(jsonld, options);
    this.isSpecificResource = true;
  }

  getScope(): object | Annotation | null {
    var raw = this.getPropertyAsObject("scope");
    if (raw?.isIRI) return raw;

    if (raw) {
      const scope = [].concat(raw)[0];
      if (scope && scope["type"] === "Annotation")
        return new Annotation(scope, this.options);
    }

    return null;
  }

  getSource(): object | AnnotationBody {
    var raw = this.getPropertyAsObject("source");
    if (raw.isIRI) return raw;

    /*
  	    this logic gets a little convoluted, because we have to preserve
  	    the cases where the raw json is an array for the sources of a
  	    SpecificResource applied to an annotation body, while for a target
  	    of an Annotation we just want a single object
  	*/
    // case of a source of a SpecificResource which is an Annotation target
    if (raw) {
      var containerTypes = ["Scene", "Canvas"];
      let singleItem = [].concat(raw)[0];
      if (containerTypes.includes(singleItem["type"])) return singleItem;
    }
    if (raw) {
      var item = [].concat(raw)[0];
      if (item) {
        return AnnotationBodyParser.BuildFromJson(item, this.options);
      }
    }
    throw new Error("cannot resolve Source " + JSON.stringify(raw));
  }

  get Source(): object | AnnotationBody {
    return this.getSource();
  }

  getSelector(): PointSelector | null {
    const propValue:unknown = this.getProperty("selector");

    const raw : object | null = ( (pv:unknown):object|null => {
        // also will not be an Array
        // if passed a an Array will return the first item in Array as return value
        let sv = pv;    // this will be converted to singleton if nec.
        if (Array.isArray(pv)){
            const ln = pv.length;
            if (ln == 0) return null;
            if (ln > 1)
                console.warn("multiple resources in SpecificResource.Selector");
            sv = pv[0];
        }
        // Dev note 20260301 : code inside the negation is the 
        // practical Javascript runtime test that something (e.g. sv ) is
        // an object but not null and not an array ( see 
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof

        if (! (typeof sv === 'object') && sv != null && !Array.isArray(sv)){
            const msg = `SpecificResource.Selector: invalid raw value ${sv}`;
            throw new Error(msg);
        }
        return sv as object;
    })(propValue);
    
    if (raw == null) return null;
    
    const visibleType = raw["type"];
    if (visibleType === "PointSelector")
        return new PointSelector(raw as object);
    else{
        const msg = `SpecificResource.Selector invalid type: ${visibleType}`;
        throw new Error(msg);
    }
  }
  
  get Selector(): PointSelector | null {
    return this.getSelector();
  }


  
  getTransform(): Transform[] {
    console.debug( "inside getTransform() ");
    var transformItems : unknown = this.getProperty("transform");
    if (transformList == null) return ([] as Transform[]);
    
     
    if (!Array.isArray(transformItems)){
        throw new Error("SpecificResource.getTransform: manifest transform property not an array");
    }
    
    return transformItems.map( (transformItem:unknown, index:number ):Transform => {
    
        try{
            if (!( typeof transformItem == 'object' && !Array.isArray(transformItem) && transformItem != null))
                throw new Error(` invalid json data`);
            return TransformParser.BuildFromJson(transformItem as object);
        }
        catch (error){
            const msg = 'SpecificResource.Transform invalid element at index ${index} : ${error}';
            throw new Error(msg);
        }
    });
  }
  
  get Transform(): Transform[] {
    return this.getTransform();
  }



}
