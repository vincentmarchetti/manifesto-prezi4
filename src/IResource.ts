
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
        try{
            if (Array.isArray(a)){
                if (a.length == 0) throw new Error("empty array");
                if (a.length == 1) a = a[0];
            }

            if (typeof a != 'object')   throw new Error('not an object');
            if ( a == null )            throw new Error('is null');
            if ( Array.isArray(a))      throw new Error('is an multi item Array');
            if ( typeof a['type'] != 'string') {
                const msg = `type property is ${typeof a['type']}`;
                throw new Error(msg);
            }
            return a as IResource;
        }
        catch (error){
            // @ts-ignore  unused msg
            const msg = `ResourceOps.cast_to_resource | ${error}`;
            return null;
        }  
    }
        
    static cast_to_array( a: unknown ) : IResource[] | null {
        try{
            if (a == null) return ([] as IResource[] );
            if (!Array.isArray(a)) {
                const tmp : IResource | null = ResourceOps.cast_to_resource(a);
                if (tmp == null){
                    const msg = `not Array nor IResource`;
                    throw new Error(msg);
                }
                return [tmp] as IResource[];
            }
            
            // at this point a is an Array
            return a.map( ( t:unknown, index:number):IResource => {
                try{
                    if (Array.isArray(t)) throw new Error("is Array");
                    const as_resource:IResource | null = ResourceOps.cast_to_resource(t);
                    if (as_resource == null ){
                        const msg = `not an IResource`;
                        throw new Error(msg);
                    }
                    return as_resource as IResource;
                }
                catch (error){                    
                    const msg = `map element ${index} | ${error}`;  
                    throw new Error(msg);
                }
            });
        }
        catch (error){
            // @ts-ignore  unused msg
            const msg = `ResourceOps.cast_to_array | ${error}`;
            return null;
        }
    }
 }