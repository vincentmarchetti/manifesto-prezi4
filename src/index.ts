export * from "./internal";

import { IIIFResource } from "./IIIFResource";
import { IManifestoOptions } from "./IManifestoOptions";
import { Utils } from "./Utils";

import {    TranslateTransform,
            RotateTransform,
            ScaleTransform,
            Collection,
            Manifest,
            SpecificResource,
            Light,
            Camera,
            TextualBody,
            Annotation,
            AnnotationPage,
            Scene,
            Sequence,
            PointSelector,
            JSONLDResource,
            IResource } from "./internal";
/**
Initiates downloading an IIIF manifest json file from URL. Returns a Promise<any>
to allow subsequent processing on a successful fetch. 

@param url  string containing the URL to Fetch
@returns Promise<any> The object returned through the Promise is the javascript object obtained by deserializing the json text.
**/
export const loadManifest: (url: string) => Promise<any> = (url: string) => {
  return Utils.loadManifest(url);
};

/**
Parses  IIIF manifest file to return a manifesto Manifest instance

@param manifest Either a string containing text of a manifest file or an javascript object obtained by deserializing by the JSON.parse function a manifest file.
@param options? TODO Not yet documented
@returns  instance of Manifest class.
**/
export const parseManifest: (
  manifest: any,
  options?: IManifestoOptions | undefined
) => IIIFResource | null = (manifest: string, options?: IManifestoOptions) => {
  return Utils.parseManifest(manifest, options);
};

JSONLDResource.ctors = {
    "TranslateTransform"	: TranslateTransform,
    "RotateTransform"	    : RotateTransform,
    "ScaleTransform"	    : ScaleTransform,
    "Collection"	        : Collection,
    "Manifest"	            : Manifest,
    "SpecificResource"	    : SpecificResource,
    "Light"	                : Light,
    "Camera"	            : Camera,
    "TextualBody"	        : TextualBody,
    "Annotation"	        : Annotation,
    "AnnotationPage"	    : AnnotationPage,
    "Scene"	                : Scene,
    "Sequence"	            : Sequence,
    "PointSelector"	        : PointSelector
};


/* 
TODO 20260305: this Constructor should support the option of passing a IManifestoOptions
object in the new call
 */
 
type JSONLDResourceConstructor = {
    new (res : IResource):JSONLDResource;
};

JSONLDResource.Construct = (jsonld: IResource, options?:IManifestoOptions):JSONLDResource => {
    // Developer Note 20260305 double checking, avoid truly mysterious failures
    // this should never happen if TypeScript based type-checking
    // is being properly used
    if (jsonld?.type == null){
        const msg = `LOGIC ERROR | JSONLDResource.Construct | invalid argument`;
        throw new Error(msg);
    }
    if (!Object.hasOwnProperty(jsonld.type)){
        const msg = `JSONLDResource.Construct | invalid argument type ${jsonld.type}`;
        throw new Error(msg);
    }
    
    const ctor = JSONLDResource.ctors(jsonld.type) as JSONLDResourceConstructor;
    return new ctor(jsonld);
}