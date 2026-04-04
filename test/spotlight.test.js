import {expect} from "chai";
import * as manifesto from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


let body_data  = null;

/*
The fragment below is from the example manifest
manifests/3_lights/multiple_lights_with_intensities_and_colors.json
at commit 09fa6e27b (4 Apr 2026)
*/
before( function(){
    body_data =
    {
      "id": "https://example.org/iiif/3d/lights/1",
      "type": "SpotLight",
      "label": {
        "en": [
          "Red Spot Light"
        ]
      },
      "color": "#ff0000",
      "intensity": {
        "type": "Value",
        "value": 100,
        "unit": "relative"
      },
      "angle": 5
    };   
});

describe('SpotLight', function() {
    
    it('SpotLight loads', function() {
        expect(body_data).to.exist; 
        const body_resource = manifesto.ResourceOps.cast_to_resource(body_data);
        const spotlight = manifesto.JSONLDResource.Construct(body_resource);
        expect(spotlight).to.exist;
        expect(spotlight.isLight).to.equal(true);
        expect(spotlight.isSpotLight).to.equal(true);
        
        expect(spotlight.Angle).to.equal(5);
        
        const rgb = spotlight.Color;
        expect(rgb.red).to.equal(255);
        expect(rgb.green).to.equal(0);
        expect(rgb.blue).to.equal(0);
        
        const intensity = spotlight.Intensity;
        expect(intensity.isValue).to.equal(true);
        expect(intensity.Value).to.equal(100.0);
        expect(intensity.Unit).to.equal("relative");
        
    });

});
