/*
Algorithms to search for annotations by id within a manifest

These function work at the JSON level rather than the instances of classes 
defined in manifesto-prezi4
*/

export function find_annotation_in_manifest( anno_id:string, manifest_data:object):object | null {
    const items : object[] = ( ():object[] => {
        const tmp = manifest_data["items"];
        if (tmp == null) return ( [] as object[] );
        if (! Array.isArray(tmp)) return [tmp as object];
        return tmp as object[];
    })();
    const init_accum : object|null = null;
    return items.reduce( (accum:object|null, container_data:object ):object|null => {
        const rv:object|null = find_annotation_in_container(anno_id, container_data);
        if (rv == null) return accum;
        return merge_annotation(rv, accum);
    },
    init_accum);
}

function merge_annotation( annotation:object, accum: object | null): object{
    if (accum == null)
        return annotation;

    /*
    merge algorithm is to add any key-values in incoming "annotation" to the
    accum object, will also detect inconsistencies
    */
     
    return Object.getOwnPropertyNames(annotation).reduce( ((res:object, name:string ):object => {
        if (Object.hasOwn( res, name )){
            /* insert the comparison of the value of properties
            that they are the same
            */
        }
        else{
            res[name] = annotation[name];
        }
        return res;
    }),
    accum);           
}

/*
container_data an object with key-value "type" "Scene" or "Canvas"
*/
function find_annotation_in_container( anno_id:string, container_data:object) : object | null {
    const items : object[] = ( ():object[] => {
        const tmp = container_data["items"];
        if (tmp == null) return ( [] as object[] );
        if (! Array.isArray(tmp)) return [tmp as object];
        return tmp as object[];
    })();
    const init_accum : object|null = null;
    return items.reduce( (accum:object|null, page_data:object ):object|null => {
        const rv:object|null = find_annotation_in_page(anno_id, page_data);
        if (rv == null) return accum;
        return merge_annotation(rv, accum);
    },
    init_accum);
}

function find_annotation_in_page( anno_id:string, page_data:object) : object | null {
    const items : object[] = ( ():object[] => {
        const tmp = page_data["items"];
        if (tmp == null) return ( [] as object[] );
        if (! Array.isArray(tmp)) return [tmp as object];
        return tmp as object[];
    })();
    const init_accum : object|null = null;
    return items.reduce( (accum:object|null, anno_data:object ):object|null => {
    
        if (anno_data["id"] === anno_id)
            return merge_annotation(anno_data, accum);

        const rv : object | null =  find_annotation_in_annotation(anno_id, anno_data);
        if (rv != null) return merge_annotation(rv, accum);
        return accum;
        
    },
    init_accum);
}

/*
searches for annotations within Canvas or Scene in body
*/
function find_annotation_in_annotation( anno_id: string, anno_data:object ) : object | null {
    /* developer note 20260425: this code will accommodate the value of the 
    body being an object or an array of length 1
    */
    
    const bodies  = ( (): object[] => {
        const rv = anno_data["body"];
        if (rv == null) return [];
        if (Array.isArray(rv)) return rv;
        return [rv];
    })();
    const init_accum : object | null = null;
    return bodies.reduce( (accum:object|null, body_data:object ) : object|null => {
        const body_or_source  = ( ():object => {
            if ( body_data["type"] === "SpecificResource" ) 
                return body_data["source"];
            return body_data;
        })();

        if (body_or_source == null ) return accum;
        if ( ["Scene","Canvas"].includes( body_or_source["type"])){
            //console.log(`searching inside ${body_or_source["type"]}`);
            const rv = find_annotation_in_container(anno_id, body_or_source);
            if (rv != null)
                return merge_annotation(rv, accum);
        }
        return accum;             
    },  init_accum );
    
}