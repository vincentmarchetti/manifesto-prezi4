import { Annotation, IManifestoOptions, ManifestResource } from "./internal";

export class AnnotationPage extends ManifestResource {
  constructor(jsonld: any, options: IManifestoOptions) {
    super(jsonld, options);
  }

  getItems(): any[] {
    return this.getProperty("items");
  }
  
  getAnnotations():Annotation[] {
    const items:any[] = this.getProperty("items") ?? [];
    return items.reduce( (accum, item:any) => {
        const item_type = item["type"] ?? "";
        if (item_type === "Annotation")
            accum.push( new Annotation(item, this.options));
        else
            console.warn("AnnotationPage.getAnnotations unrecognized item_type ${item_type}");
        return accum;
    },
    []);
  }
}
