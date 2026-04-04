import colorString  from "color-string";

export class Color {
    /**
    * @param cssTerm - hex representtion of color as used in CSS. Ex "#FF0000" as red
    * @returns Color instance.
    **/
    static fromCSS(cssTerm: string): { red:number, green:number, blue:number }{
        const cc = colorString.get(cssTerm);
        if (cc.model !== "rgb")
            throw new Error(`Color.fromCSS | unsupported color string: ${cssTerm}`);
        return {
            red:   cc.value[0],
            green: cc.value[1],
            blue:  cc.value[2]
        };
    }
}   
