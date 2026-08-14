import {
  Duration,
  IManifestoOptions,
  ManifestResource,
  TreeNode,
  TreeNodeType
} from "./internal.js";
import {
  ViewingDirection,
  ViewingHint,
} from "@iiif/vocabulary/dist-commonjs/index.js";

export class Range extends ManifestResource {
  private _ranges: Range[] | null = null;
  public canvases: string[] | null = null;
  public items: ManifestResource[] = [];
  public parentRange: Range | undefined;
  public path: string;
  public treeNode: TreeNode;

  constructor(jsonld?: any, options?: IManifestoOptions) {
    super(jsonld, options);
  }

  getCanvasIds(): string[] {
    if (this.__jsonld.canvases) {
      return this.__jsonld.canvases;
    } else if (this.canvases) {
      return this.canvases;
    }

    return [];
  }


  getViewingDirection(): ViewingDirection | null {
    return this.getProperty("viewingDirection");
  }

  getViewingHint(): ViewingHint | null {
    return this.getProperty("viewingHint");
  }



}
