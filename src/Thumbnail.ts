import { IManifestoOptions, Resource } from "./internal.js";

export class Thumbnail extends Resource {
  constructor(jsonld: any, options: IManifestoOptions) {
    super(jsonld, options);
  }
}
