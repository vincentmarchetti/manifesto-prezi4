import {expect} from "chai";
import {find_annotation_in_manifest} from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


let manifest_json  = null;
 
before(function(){
    const manifest_path = './test/fixtures/prezi4-examples/uc06_canvas_in_scene.json';
    manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
});
               
describe('seach_annotation', function() {
    
    it('null search', function() {
        expect(manifest_json).to.exist; 
        const null_result = find_annotation_in_manifest("no-id", manifest_json);
        expect(null_result).to.equal(null);
    });

    it('annotation search', function() {
        expect(manifest_json).to.exist; 
        const anno_id = "https://iiif.io/api/presentation/4.0/example/uc06/scene/canvas-scene/anno/1";
        const found = find_annotation_in_manifest(anno_id , manifest_json);
        expect(found).to.exist;
        expect(found["type"]).to.equal("Annotation");
    });
    
    it('canvas in scene annotation search', function() {
        expect(manifest_json).to.exist; 
        const anno_id = "https://iiif.io/api/presentation/4.0/example/uc06/canvas/chessboard/anno/1";
        const found = find_annotation_in_manifest(anno_id , manifest_json);
        expect(found).to.exist;
        expect(found["type"]).to.equal("Annotation");
    });

        
    
});