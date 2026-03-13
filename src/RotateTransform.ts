import { Transform } from "./internal";

export class RotateTransform extends Transform {
  constructor(jsonld?: any) {
    super(jsonld);
    this.isRotateTransform = true;
  }

  get AxesValues():Number[]{
    return ["x","y","z"].map( (axis:string):Number => {
        const raw = this.ResourceProperty(axis);
        if (raw == null) return 0.0;
        const conv = Number(raw);
        if (conv != null) return (conv as Number);
        const msg = `RotateTransform.AxesValues | axis ${axis} not a number`;
        throw new Error(msg);
    })
  }

}
