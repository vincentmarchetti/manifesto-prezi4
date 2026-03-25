import {
  //Deserialiser,
  
  IIIFResource,
  IManifestoOptions,
  JSONLDResource
  
} from "./internal.js";
import {
  MediaType,
  ServiceProfile,
  ServiceType,
} from "@iiif/vocabulary/dist-commonjs/index.js";

//import "isomorphic-unfetch";

export class Utils {

  static getInexactLocale(locale: string): string {
    if (locale.indexOf("-") !== -1) {
      return locale.substr(0, locale.indexOf("-"));
    }

    return locale;
  }

  static getLocalisedValue(resource: any, locale: string): string | null {
    // if the resource is not an array of translations, return the string.
    if (!Array.isArray(resource)) {
      return resource;
    }

    // test for exact match
    for (let i = 0; i < resource.length; i++) {
      const value = resource[i];
      const language = value["@language"];

      if (locale === language) {
        return <string>value["@value"];
      }
    }

    // test for inexact match
    const match: string = locale.substr(0, locale.indexOf("-"));

    for (let i = 0; i < resource.length; i++) {
      var value = resource[i];
      var language = value["@language"];

      if (language === match) {
        return <string>value["@value"];
      }
    }

    return null;
  }

  /* 
static generateTreeNodeIds(treeNode: TreeNode, index: number = 0): void {
    let id: string;

    if (!treeNode.parentNode) {
      id = "0";
    } else {
      id = treeNode.parentNode.id + "-" + index;
    }

    treeNode.id = id;

    for (let i = 0; i < treeNode.nodes.length; i++) {
      var n: TreeNode = treeNode.nodes[i];
      Utils.generateTreeNodeIds(n, i);
    }
  }
 */

/* 
  static normaliseType(type: string): string {
    type = (type || "").toLowerCase();

    if (type.indexOf(":") !== -1) {
      const split: string[] = type.split(":");
      return split[1];
    }

    return type;
  }
 */



}
