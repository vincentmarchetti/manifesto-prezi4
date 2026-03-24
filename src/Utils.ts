import {
  //Deserialiser,
  IAccessToken,
  IExternalResource,
  IIIFResource,
  IManifestoOptions,
  JSONLDResource,
  Service,
  StatusCode,
  TreeNode,
} from "./internal.js";
import {
  MediaType,
  ServiceProfile,
  ServiceType,
} from "@iiif/vocabulary/dist-commonjs/index.js";
import {
  OK,
  MOVED_TEMPORARILY,
  UNAUTHORIZED,
} from "@edsilv/http-status-codes/dist-commonjs/index.js";
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

  static normaliseType(type: string): string {
    type = (type || "").toLowerCase();

    if (type.indexOf(":") !== -1) {
      const split: string[] = type.split(":");
      return split[1];
    }

    return type;
  }

  static normaliseUrl(url: string): string {
    url = url.substr(url.indexOf("://"));

    if (url.indexOf("#") !== -1) {
      url = url.split("#")[0];
    }

    return url;
  }

  static normalisedUrlsMatch(url1: string, url2: string): boolean {
    return Utils.normaliseUrl(url1) === Utils.normaliseUrl(url2);
  }



/* 
  static checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      var error = new Error(response.statusText);
      (error as any).response = response;
      return Promise.reject(error);
    }
  }
 */

/* 
  static loadManifest(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fetch(url)
        .then(Utils.checkStatus)
        .then((r) => r.json())
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject();
        });
    });
  }
 */



/* 
  static async attemptResourceWithToken(
    resource: IExternalResource,
    openTokenService: (
      resource: IExternalResource,
      tokenService: Service
    ) => Promise<any>,
    authService: Service
  ): Promise<IExternalResource | void> {
    // attempting token interaction for " + authService["@id"]
    const tokenService: Service | null = authService.getService(
      ServiceProfile.AUTH_1_TOKEN
    );

    if (tokenService) {
      // found token service: " + tokenService["@id"]);
      const tokenMessage: any = await openTokenService(resource, tokenService);

      if (tokenMessage && tokenMessage.accessToken) {
        await resource.getData(tokenMessage);
        return resource;
      }
    }
  }

 */


/* 
  static createError(name: StatusCode, message: string): Error {
    const error: Error = new Error();
    error.message = message;
    error.name = String(name);
    return error;
  }
 */

/* 
  static createAuthorizationFailedError(): Error {
    return Utils.createError(
      StatusCode.AUTHORIZATION_FAILED,
      "Authorization failed"
    );
  }
 */

/* 
  static createRestrictedError(): Error {
    return Utils.createError(StatusCode.RESTRICTED, "Restricted");
  }

  static createInternalServerError(message: string): Error {
    return Utils.createError(StatusCode.INTERNAL_SERVER_ERROR, message);
  }
 */


/* 
  static getService(resource: any, profile: ServiceProfile): Service | null {
    const services: Service[] = this.getServices(resource);

    for (let i = 0; i < services.length; i++) {
      const service: Service = services[i];

      if (service.getProfile() === profile) {
        return service;
      }
    }

    return null;
  }
 */

/* 
  static getResourceById(
    parentResource: JSONLDResource,
    id: string
  ): JSONLDResource {
    return <JSONLDResource>(
      Utils.traverseAndFind(parentResource.__jsonld, "@id", id)
    );
  }
 */

  /**
   * Does a depth first traversal of an Object, returning an Object that
   * matches provided k and v arguments
   * @example Utils.traverseAndFind({foo: 'bar'}, 'foo', 'bar')
   */

  static traverseAndFind(
    object: any,
    k: string,
    v: string
  ): object | undefined {
    if (object.hasOwnProperty(k) && object[k] === v) {
      return object;
    }

    for (var i = 0; i < Object.keys(object).length; i++) {
      if (typeof object[Object.keys(object)[i]] === "object") {
        var o = Utils.traverseAndFind(object[Object.keys(object)[i]], k, v);
        if (o != null) {
          return o;
        }
      }
    }

    return undefined;
  }

/* 
  static getServices(
    resource: any,
    {
      onlyService = false,
      onlyServices = false,
      skipParentResources = false,
    }: {
      onlyServices?: boolean;
      skipParentResources?: boolean;
      onlyService?: boolean;
    } = {}
  ): Service[] {
    const services: Service[] = [];

    // Resources can reference "services" on the manifest. This is a bit of a hack to just get the services from the manifest
    // too. What would be better is if this was used as a "Map" of full services.
    // So when you come across { id: '...' } without any data, you can "lookup" services from the manifest.
    // I would have implemented this if I was confident that it was reliable. Instead, I opted for the safest option that
    // should not break any existing services.
    if (
      !skipParentResources &&
      resource &&
      resource.options &&
      resource.options.resource &&
      resource.options.resource !== resource
    ) {
      services.push(
        ...Utils.getServices(resource.options.resource, { onlyServices: true })
      );
    }

    let service = !onlyServices
      ? (resource.__jsonld || resource).service || []
      : [];

    // coerce to array
    if (!Array.isArray(service)) {
      service = [service];
    }

    if (!onlyService) {
      // Some resources also have a `.services` property.
      // https://iiif.io/api/presentation/3.0/#services
      service.push(...((resource.__jsonld || resource).services || []));
    }

    if (service.length === 0) {
      return services;
    }

    for (let i = 0; i < service.length; i++) {
      const s: any = service[i];

      if (typeof s === "string") {
        const r: JSONLDResource = this.getResourceById(
          resource.options.resource,
          s
        );

        if (r) {
          services.push(new Service(r.__jsonld || r, resource.options));
        }
      } else {
        services.push(new Service(s, resource.options));
      }
    }

    return services;
  }
 */

  static getTemporalComponent(target: string): number[] | null {
    const temporal: RegExpExecArray | null = /t=([^&]+)/g.exec(target);
    let t: number[] | null = null;

    if (temporal && temporal[1]) {
      t = <any>temporal[1].split(",");
    }

    return t;
  }
}
