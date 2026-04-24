import {expect} from "chai";
import * as manifesto from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


let manifest_json  = null;
 
before(function(){
    const manifest_path = './test/fixtures/prezi4-examples/uc06_multiple_3d_objects.json';
    manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
});
               
describe('seach_annotation', function() {
    
    it('manifest loads', function() {
        expect(manifest_json).to.exist; 
    });
        
});