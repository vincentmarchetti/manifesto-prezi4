import {
  ViewingHint,
  Behavior,
  ViewingDirection,
  ServiceProfile,
} from "@iiif/vocabulary/dist-commonjs/index.js";
import {
  IManifestoOptions,
  IIIFResource,
  IResource,
  JSONLDResource,
  ManifestResource,
  ResourceOps,
  Range,
  TreeNode,
  TreeNodeType
} from "./internal.js";

/**
 * @remarks Scenes are conveniently retrieved from a Manifest by iterating through
 * Sequence in the Manifest, inner loop the Scenes in each sequence
 * @see {@link Sequence }
 *
 * @example
 * var manifest: Manifest;
 * function doSomethingWithScene(scene:Scene)...
 * ...
 * foreach(var seq:Sequence of manifest.getSequences()
 *   foreach(var scene : Scene of seq.getScenes()
 *     doSomethingWithScene(scene);
 **/
export class Manifest extends IIIFResource {
  public index: number = 0;
  private _allRanges: Range[] | null = null;
  private _topRanges: Range[] = [];

  constructor(jsonld?: any, options?: IManifestoOptions) {
    super(jsonld, options);

    if (this.__jsonld.structures && this.__jsonld.structures.length) {
      const topRanges: any[] = this._getTopRanges();

      for (let i = 0; i < topRanges.length; i++) {
        const range: any = topRanges[i];
        this._parseRanges(range, String(i));
      }
    }

    // initialization the cached _annotationIdMap to null
    // it will be populated if and only if client calls make a request
    // to the getter annotationIdMap
    this._annotationIdMap = null;
  }

  /** @deprecated Use getAccompanyingCanvas instead */
  getPosterCanvas(): unknown {
    return null;
  }

  getAccompanyingCanvas(): unknown {
    return null;
  }

  get Items() : ManifestResource[] {
    try{
        const itemsProp : unknown = this.ResourceProperty("items");
        const resourceItems:IResource[] | null = ResourceOps.cast_to_array( itemsProp );
        
        if (resourceItems == null ){
            const msg = `ManifestResource.Items | invalid value`;
            throw new Error(msg);
        }
        return resourceItems.map( (item:IResource, index:number):ManifestResource => {
            try{
                const resource:JSONLDResource = JSONLDResource.Construct( item, this.options);
                if (!["Scene","Canvas"].includes( resource.ResourceType)) 
                    throw new Error("not a container");
                return resource as ManifestResource;
            }
            catch (error){
                const msg = 'map at element ${index} | ${error}';
                throw new Error(msg);
            }
        });
    }
    catch (error){
        const msg = `Manifest.Items | ${error}`;
        throw new Error(msg);
    }
   
    
  }

  getBehavior(): Behavior | null {
    let behavior: any = this.getProperty("behavior");

    if (Array.isArray(behavior)) {
      behavior = behavior[0];
    }

    if (behavior) {
      return behavior;
    }

    return null;
  }

  /* 
public getDefaultTree(): TreeNode {
    super.getDefaultTree();

    this.defaultTree.data.type = Utils.normaliseType(TreeNodeType.MANIFEST);

    if (!this.isLoaded) {
      return this.defaultTree;
    }

    const topRanges: Range[] = this.getTopRanges();

    // if there are any ranges in the manifest, default to the first 'top' range or generated placeholder
    if (topRanges.length) {
      topRanges[0].getTree(this.defaultTree);
    }

    Utils.generateTreeNodeIds(this.defaultTree);

    return this.defaultTree;
  }
 */

  private _getTopRanges(): any[] {
    const topRanges: any[] = [];

    if (this.__jsonld.structures && this.__jsonld.structures.length) {
      for (let i = 0; i < this.__jsonld.structures.length; i++) {
        const json: any = this.__jsonld.structures[i];
        if (json.viewingHint === ViewingHint.TOP) {
          topRanges.push(json);
        }
      }

      // if no viewingHint="top" range was found, create a default one
      if (!topRanges.length) {
        const range: any = {};
        range.ranges = this.__jsonld.structures;
        topRanges.push(range);
      }
    }

    return topRanges;
  }

  public getTopRanges(): Range[] {
    return this._topRanges;
  }

  private _getRangeById(id: string): Range | null {
    if (this.__jsonld.structures && this.__jsonld.structures.length) {
      for (let i = 0; i < this.__jsonld.structures.length; i++) {
        const r = this.__jsonld.structures[i];
        if (r["@id"] === id || r.id === id) {
          return r;
        }
      }
    }

    return null;
  }

  //private _parseRangeCanvas(json: any, range: Range): void {
  // todo: currently this isn't needed
  //var canvas: IJSONLDResource = new JSONLDResource(json);
  //range.items.push(<IManifestResource>canvas);
  //}

  private _parseRanges(r: any, path: string, parentRange?: Range): void {
    let id: string | null = null;

    if (typeof r === "string") {
      id = r;
      r = this._getRangeById(id);
    }

    if (!r) {
      return;
    }

    const range: Range = new Range(r, this.options);
    range.parentRange = parentRange;
    range.path = path;

    if (!parentRange) {
      this._topRanges.push(range);
    } else {
      parentRange.items.push(range);
    }

    const items = r.items || r.members;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item: any = items[i];

        // todo: use an ItemType constant?
        if (
          (item["@type"] && item["@type"].toLowerCase() === "sc:range") ||
          (item["type"] && item["type"].toLowerCase() === "range")
        ) {
          this._parseRanges(item, path + "/" + i, range);
        } else if (
          (item["@type"] && item["@type"].toLowerCase() === "sc:canvas") ||
          (item["type"] && item["type"].toLowerCase() === "canvas")
        ) {
          // store the ids on the __jsonld object to be used by Range.getCanvasIds()
          if (!range.canvases) {
            range.canvases = [];
          }

          const id: string = item.id || item["@id"];

          range.canvases.push(id);
        }
      }
    } else if (r.ranges) {
      for (let i = 0; i < r.ranges.length; i++) {
        this._parseRanges(r.ranges[i], path + "/" + i, range);
      }
    }
  }

  /* 
getAllRanges(): Range[] {
    if (this._allRanges != null) return this._allRanges;

    this._allRanges = [];

    const topRanges: Range[] = this.getTopRanges();

    for (let i = 0; i < topRanges.length; i++) {
      const topRange: Range = topRanges[i];
      if (topRange.id) {
        this._allRanges.push(topRange); // it might be a placeholder root range
      }
      const reducer = (acc, next) => {
        acc.add(next);
        const nextRanges = next.getRanges();
        if (nextRanges.length) {
          return nextRanges.reduce(reducer, acc);
        }
        return acc;
      };
      const subRanges: Range[] = Array.from(
        topRange.getRanges().reduce(reducer, new Set())
      );
      this._allRanges = this._allRanges.concat(subRanges);
    }

    return this._allRanges;
  }
 */

  /* 
getRangeById(id: string): Range | null {
    const ranges: Range[] = this.getAllRanges();

    for (let i = 0; i < ranges.length; i++) {
      const range: Range = ranges[i];
      if (range.id === id) {
        return range;
      }
    }

    return null;
  }

  getRangeByPath(path: string): Range | null {
    const ranges: Range[] = this.getAllRanges();

    for (let i = 0; i < ranges.length; i++) {
      const range: Range = ranges[i];
      if (range.path === path) {
        return range;
      }
    }

    return null;
  }
 */


 /* 
 getManifestType(): ManifestType {
    const service: Service = <Service>(
      this.getService(ServiceProfile.UI_EXTENSIONS)
    );
    if (service) {
      return service.getProperty("manifestType");
    }
    return ManifestType.EMPTY;
  }
 */


  isPagingEnabled(): boolean {
    const viewingHint: ViewingHint | null = this.getViewingHint();

    if (viewingHint) {
      return viewingHint === ViewingHint.PAGED;
    }

    const behavior: Behavior | null = this.getBehavior();

    if (behavior) {
      return behavior === Behavior.PAGED;
    }

    return false;
  }

  getViewingDirection(): ViewingDirection | null {
    return this.getProperty("viewingDirection");
  }

  getViewingHint(): ViewingHint | null {
    return this.getProperty("viewingHint");
  }

  _annotationIdMap: any;

  /**
   * Developer Note: The concept of the "id map" appear in the
   * JSON-LD specification https://www.w3.org/TR/json-ld11/#dfn-id-map
   * This functionality may be available as well in the 'nodeMap' code of the
   * digitalbazaar/jsonld library
   *
   * this very simplified version just returns a mao of id -> Annotation nodes
   * in manifest
   *
   * THe annotationIdMap is a Javascript object whose property names are
   * IRI (id values) and property values are instances of the Annotation class
   **/
  get annotationIdMap(): Object {
    if (this._annotationIdMap == null) {
      this._annotationIdMap = {};
    }
    return this._annotationIdMap;
  }
}
