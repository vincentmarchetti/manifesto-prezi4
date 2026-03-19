import {
  IManifestoOptions,
  ManifestResource,
  IResource,
  JSONLDResource,
  Color
} from "./internal.js";

export class Light extends ManifestResource {
  constructor(jsonld: IResource, options?: IManifestoOptions) {
    super(jsonld, options);
  }


  get Color(): Color | null {
    return null;
    /*
    var hexColor = this.getPropertyFromSelfOrSource("color");
    if (hexColor) return Color.fromCSS(hexColor);
    else return new Color([255, 255, 255]); // white light
    */
  }

  /**
   * The implementation of the intensity is based on
   * {@link https://github.com/IIIF/3d/blob/main/temp-draft-4.md | temp-draft-4.md }
   * and the example 3D manifests
   * {@link https://github.com/IIIF/3d/tree/main/manifests/3_lights | lights }
   * on 24 Mar 2024. The intensity property in the manifest is an object
   * with declared type 'Value', a numeric property named 'value' and a
   * property named unit . This implementation will only work with a unit == 'relative'
   * and it will be assumed that a relative unit value of 1.0 corresponds to the
   * brightest light source a rendering engine supports.
   *
   * This code will implement a default intensity of 1.0
   **/
  /*
  getIntensity(): number |  null {
    var intObject = this.getPropertyFromSelfOrSource("intensity");
    if (intObject) {
      try {
        if (!(intObject.type === "Value" && intObject.unit === "relative"))
          throw new Error();
        return intObject.value as number;
      } catch (err) {
        throw new Error(
          "unable to interpret raw intensity object " +
            JSON.stringify(intObject)
        );
      }
    } else return 1.0;
  }
 */
 
  get Intensity(): number | null {
    return null;
    /*
    var intObject = this.getPropertyFromSelfOrSource("intensity");
    if (intObject) {
      try {
        if (!(intObject.type === "Value" && intObject.unit === "relative"))
          throw new Error();
        return intObject.value as number;
      } catch (err) {
        throw new Error(
          "unable to interpret raw intensity object " +
            JSON.stringify(intObject)
        );
      }
    } else return 1.0;
    */
  }

  /**
  * As defined in the temp-draft-4.md ( 
  * https://github.com/IIIF/3d/blob/main/temp-draft-4.md#lights ; 12 May 2024)
  * this quantity is the half-angle of the cone of the spotlight. 
  *
  * The inconsistency between this definition of the angle and the definition of
  * fieldOfView for PerspectiveCamera (where the property value defines the full angle) has
  * already been noted: https://github.com/IIIF/api/issues/2284
  *
  * provisional decision is to return undefined in case that this property 
  * is accessed in a light that is not a spotlight
  *
  *
  * @returns number
  
  **/
  
  get Angle(): number | null {
    return null;
    /*
    if (this.isSpotLight()) {
      return Number(this.getPropertyFromSelfOrSource("angle"));
    } else {
      return undefined;
    }
    */
  }

  /**
   * @return : if not null, is either a PointSelector, or an object
   * with an id matching the id of an Annotation instance.
   **/
  /*
  getLookAt(): object | PointSelector | null {
    let rawObj = this.getPropertyAsObject("lookAt") ?? null;
    if (rawObj == null) return null;

    let rawType = (rawObj["type"] || rawObj["@type"]) ?? null;
    if (rawType == null) return null;

    if (rawType == "Annotation") {
      return rawObj;
    }
    if (rawType == "PointSelector") {
      return new PointSelector(rawObj);
    }
    throw new Error(`unidentified value of lookAt ${rawType}`);
  }
  */
  
  get LookAt(): JSONLDResource | null {
    return null;
    /*
    let rawObj = this.getPropertyAsObject("lookAt") ?? null;
    if (rawObj == null) return null;

    let rawType = (rawObj["type"] || rawObj["@type"]) ?? null;
    if (rawType == null) return null;

    if (rawType == "Annotation") {
      return rawObj;
    }
    if (rawType == "PointSelector") {
      return new PointSelector(rawObj);
    }
    throw new Error(`unidentified value of lookAt ${rawType}`);
    */
  }

  get isAmbientLight(): boolean {
    return (this.ResourceType === 'AmbientLight');
  }

  get isDirectionalLight(): boolean {
    return (this.ResourceType === 'DirectionalLight');
  }

  get isPointLight(): boolean {
    return (this.ResourceType === 'PointLight');
  }

  get isSpotLight(): boolean {
    return (this.ResourceType === 'SpotLight');
  }
  
  get isLight():boolean {
    return true;
  
  }
  
}
