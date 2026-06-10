import {expect} from "chai";
import * as manifesto from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


describe('iiif_canvas_with_bgcolor_forward.json', function() {
    let manifest, scene, annotation , canvas   
    
    it('loads', function() {
        const manifest_path = './test/fixtures/6_2d_canvases_in_scene/iiif_canvas_with_bgcolor_forward.json';
        const manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
        manifest = manifesto.buildManifest(manifest_json);
        expect(manifest).to.be.instanceOf(manifesto.Manifest);
    });
    
    it('contains Canvas', function(){
        canvas = manifest.Items[1];
        expect(canvas).to.exist;
        expect(canvas.isScene).to.not.be.ok;
        expect(canvas.isCanvas).to.equal(true);        
    });
});