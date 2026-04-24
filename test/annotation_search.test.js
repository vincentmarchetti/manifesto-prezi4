import {expect} from "chai";
import {find_annotation_in_manifest} from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


let manifest_json  = null;
 
before(function(){
    const manifest_path = './test/fixtures/prezi4-examples/uc06_multiple_3d_objects.json';
    manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
});
               
describe('seach_annotation', function() {
    
    it('null search', function() {
        expect(manifest_json).to.exist; 
        const null_result = find_annotation_in_manifest("no-id", manifest_json);
        expect(null_result).to.equal(null);
    });

    it('null search', function() {
        expect(manifest_json).to.exist; 
        const anno_id = "https://iiif.io/api/presentation/4.0/example/uc06/3d/anno2";
        const found = find_annotation_in_manifest(anno_id , manifest_json);
        expect(found).to.exist;
        expect(found["type"]).to.equal("Annotation");
    });
        
    
});