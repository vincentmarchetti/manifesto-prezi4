import {
  IManifestoOptions,
  ManifestResource,
  JSONLDResource,
  IResource
} from "./internal";

export class Camera extends ManifestResource {
  constructor(jsonld: IResource, options?: IManifestoOptions) {
    super(jsonld, options);
  }

  /**
  @returns full angular size of perspective viewport in vertical direction.
  Angular unit is degrees
  **/
  
  get FieldOfView(): number | null {
    if (!this.isPerspectiveCamera ) return null;
    const raw = this.ResourceProperty("fieldOfView");
    if (raw == null) return null;
    const rawType:string = typeof raw;
    if (rawType != 'string') throw new Error(`invalid FieldOfView type ${rawType}`);
    return raw as number;
  }

  /**
  @returns full linear size of orthographic viewport in vertical direction.
  linear unit is Scene global unit of measure
  
  Name of this property was originally Height, has been changed
  at this revision to ViewHeight:
  See issues at https://github.com/IIIF/api/issues/2289
  **/
  /*
  getViewHeight(): number | undefined {
    if (this.isOrthographicCamera ) {
      // the term viewHeight for the resource Type was suggested
      // in https://github.com/IIIF/api/issues/2289#issuecomment-2161608587
      var value = this.getProperty("viewHeight");
      if (value) return value;
      else return undefined;
    } else return undefined;
  }

  get ViewHeight(): number | undefined {
    return this.getViewHeight();
  }
  */
  /**
   * @return : if not null, is either a PointSelector, an object
   * with an id matching the id of an Annotation instance, or a
   * SpecificResource with a PointSelector .
   **/
  
  get LookAt(): JSONLDResource | null {
    // TODO add identifying and parsing
    console.log(`Camera.LookAt not yet implemented`)
    return null;
  }

  /**
  @returns the near plane value, i.e. the minimum distance from the camera at 
  which something in the space must exist in order to be viewed by the camera. 
  **/
  /*
  getNear(): number | undefined {
    var value = this.getPropertyFromSelfOrSource("near");
    if (value) return value;
    else return undefined;
  }
  */
  /**
  Near plane value of the camera.
  **/
  /*
  get Near(): number | undefined {
    return this.getNear();
  }
  */
  /**
  @returns the far plane value, i.e. the maximum distance from the camera at 
  which something in the space must exist in order to be viewed by the camera. 
  **/
/* 
  getFar(): number | undefined {
    var value = this.getPropertyFromSelfOrSource("far");
    if (value) return value;
    else return undefined;
  }
 */
  /**
  Far plane value of the camera.
  **/
/* 
  get Far(): number | undefined {
    return this.getFar();
  }
 */

  get isPerspectiveCamera(): boolean {
    return this.ResourceType === "PerspectiveCamera";
  }

  get isOrthographicCamera(): boolean {
    return this.ResourceType === "OrthographicCamera";
  }
  
  get isCamera(): boolean{
    return true ;
  }
}
