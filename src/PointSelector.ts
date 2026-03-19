import { JSONLDResource } from "./JSONLDResource.js"
import { IResource      } from "./IResource.js";

 
export class PointSelector extends JSONLDResource {
  isPointSelector: boolean = true;

  constructor(jsonld: IResource ) {
    super(jsonld);
  }

  get AxesValues():Number[]{
    return ["x","y","z"].map( (axis:string):Number => {
        const raw = this.ResourceProperty(axis);
        if (raw == null) return 0.0;
        const conv = Number(raw);
        if (conv == null){
            const msg = `PointSelector.AxesValues | axis ${axis} not a number`;
            throw new Error(msg);
        }
        return (conv as Number);
    });
  }
}
