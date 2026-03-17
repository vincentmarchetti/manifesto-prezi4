export * from "./internal";


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
            Model,
            PointSelector,
            JSONLDResource,
            IResource,
            ResourceOps } from "./internal";
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
    "PointSelector"	        : PointSelector,
    "Model"                 : Model
};



/* 
This definition adds an extra argument options not used by JSONLResource ctor
The justification is that Javascript does not care about extra arguments 
 */
type JSONLDResourceConstructor = {
    new (res : IResource, options?:IManifestoOptions | null ):JSONLDResource;
};

JSONLDResource.Construct = (jsonld: IResource, options?:IManifestoOptions | null):JSONLDResource => {
    // Developer Note 20260305 double checking, avoid truly mysterious failures
    // this should never happen if TypeScript based type-checking
    // is being properly used
    if (jsonld?.type == null){
        const msg = `LOGIC ERROR | JSONLDResource.Construct | invalid argument`;
        throw new Error(msg);
    }
    if (!JSONLDResource.ctors.hasOwnProperty(jsonld.type)){
        const msg = `JSONLDResource.Construct | invalid argument type ${jsonld.type}`;
        throw new Error(msg);
    }
    
    const ctor = JSONLDResource.ctors[ jsonld.type ] as JSONLDResourceConstructor;
    return new ctor(jsonld, options);
}

/**
Parses  IIIF manifest file to return a manifesto Manifest instance

@param manifest Either a string containing text of a manifest file or an javascript object obtained by deserializing by the JSON.parse function a manifest file.
@param options? TODO Not yet documented
@returns  instance of Manifest class.
**/
export const parseManifest : (manifest_json: unknown,options?: IManifestoOptions ) => Manifest  =(
    (manifest_json: unknown,options?: IManifestoOptions ) => {
    if (typeof manifest_json === 'string'){
        manifest_json = JSON.parse(manifest_json);
    }
    return buildManifest(manifest_json, options);
})

export const buildManifest : (manifest_data : unknown, options?: IManifestoOptions)=> Manifest = (
    (manifest_data : unknown, options?: IManifestoOptions):Manifest => {
    /*
    Sanity checks
    */
    if (manifest_data == null || typeof manifest_data === "string"){
        const msg:string = `buildManifest | invalid arg ${typeof manifest_data}`;
        throw new Error(msg);
    }
    
    const valid_manifest_json  = ((man_data:unknown): IResource =>{
        const rv = ResourceOps.cast_to_resource( man_data );
        if (rv == null){
            const msg = `parseManifest | invalid json/other passed`;
            throw new Error(msg);
        }
        return rv as IResource;
    })( manifest_data );
    
    if (valid_manifest_json.type !== "Manifest"){
        const msg = `parseManifest | valid json does not have type="Manifest" property`;
        throw new Error(msg);
    }
    
    return JSONLDResource.Construct( valid_manifest_json, options ) as Manifest;
})
