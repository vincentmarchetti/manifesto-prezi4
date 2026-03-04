
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
             typeof a != 'object' ) return null;
    }
             
    static coerce_to_resource( a:unknown , allow_array = True ) : IResource | null {
        a = ( (x:unknown):unknown  => {
            if (Array.isArray(x)){
                const n = x.length;
                if (n==0)
                    return null;
                if (n > 1){
                    const mgs = `IResourceOps.coerce_to_resource : multi item array`;
                    console.warn(msg);
                }
                return x[0];
            }
            return x;
        })(a);
        
        return ResourceOps.cast_to_resource(a);
    }
 }