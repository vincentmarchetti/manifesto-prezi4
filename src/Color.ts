import colorString  from "color-string";

/*
Developer note 5 Apr 2026
In the current draft Presentation 4 documents there is no Color as a resource class,
color properties of lights and background are CSS-like strings such as "#0000FF"
for blue.

The class Color is not an JSONLDResource descendant, does not have ResourceType or
ResourceID, only implements an interface {red:number,green:number,blue:number}

all red green blue values are integer >= 0 ; <= 255
*/
export class Color {
    /**
    * @param cssTerm - hex representtion of color as used in CSS. Ex "#FF0000" as red
    * @returns Color instance.
    **/
    
    readonly red:number;
    readonly green:number;
    readonly blue:number;
    
    constructor(_red:number, _green:number, _blue:number){
        this.red   = _red;
        this.green = _green;
        this.blue  = _blue;
    }
    
    
    static fromCSS(cssTerm: string): Color  {
        const cc = colorString.get(cssTerm);
        if (cc.model !== "rgb")
            throw new Error(`Color.fromCSS | unsupported color string: ${cssTerm}`);
        return new Color(cc.value[0], cc.value[1], cc.value[2]);
    }
}   
