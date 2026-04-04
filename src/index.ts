export * from "./internal.js";


import { IManifestoOptions } from "./IManifestoOptions.js";
import { Utils } from "./Utils.js";

import {    TranslateTransform,
            RotateTransform,
            ScaleTransform,
            Collection,
            Manifest,
            SpecificResource,
            SpotLight,
            Camera,
            TextualBody,
            Annotation,
            AnnotationPage,
            Scene,
            Model,
            PointSelector,
            JSONLDResource,
            IResource,
            ResourceOps,
            Value } from "./internal.js";


JSONLDResource.ctors = {
    "TranslateTransform"	: TranslateTransform,
    "RotateTransform"	    : RotateTransform,
    "ScaleTransform"	    : ScaleTransform,
    "Collection"	        : Collection,
    "Manifest"	            : Manifest,
    "SpecificResource"	    : SpecificResource,
    "SpotLight"	            : SpotLight,
    "PerspectiveCamera"	    : Camera,
    "TextualBody"	        : TextualBody,
    "Annotation"	        : Annotation,
    "AnnotationPage"	    : AnnotationPage,
    "Scene"	                : Scene,
    "PointSelector"	        : PointSelector,
    "Model"                 : Model,
    "Value"                 : Value
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
