
/* 
Developer Note: 3 Mar 2026
This file and its contents should not be confused with IIIFResource.ts'

This file defines a Type interface name IResource. This interface is characteristic
of the items in a IIIF Manifest Resource. An IResource is an object, not null, not an 
Array, which has a string-valued type property and optionally a string valued id property.

This file also defines a class IResourceOps which as run time can identify whether
an Javascript value has these characteristics or if it can be distilled down to something
with these characteristics.
 */
 
export interface IResource{
    type : string;
    id?  : string;
 }
 
 export class ResourceOps{
    static cast_to_resource(a : unknown ) : IResource | null {
        if ( a == null ||
             Array.isArray(a) ||
             typeof a != 'object' ||
             typeof a['type'] !== 'string' ) {
                const msg = `ResourceOps.cast_to_resource ${a} ${a==null} ${Array.isArray(a)} ${typeof a}`;
                throw new Error(msg);
                return null;
             }
        return a as IResource;        
    }
             
    static coerce_to_resource( a:unknown , coerce_array = true ) : IResource | null {
        if ( coerce_array && Array.isArray(a)){
            a = ( (x:unknown[] ):unknown  => {               
                const n = x.length;
                if (n==0)
                    return null;
                if (n > 1){
                    const msg = `IResourceOps.coerce_to_resource : multi item array`;
                    console.warn(msg);
                }
                return x[0];                
            })(a as unknown[] );
        }
        return ResourceOps.cast_to_resource(a);
    }
 }