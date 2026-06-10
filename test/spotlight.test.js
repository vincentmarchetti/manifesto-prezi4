import {expect} from "chai";
import * as manifesto from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


let body_data  = null;

before(function(){
    const manifest_path = './test/fixtures/3_lights/multiple_lights_with_intensities_and_colors.json';
    const manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
    body_data = manifest_json?.items[0]?.items[0]?.items[0]["body"]["source"];
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
        expect(intensity.isQuantity).to.equal(true,"isQuantity property");
        expect(intensity.QuantityValue).to.equal(1.0);
        expect(intensity.Unit).to.equal("relative");
        
    });

});
