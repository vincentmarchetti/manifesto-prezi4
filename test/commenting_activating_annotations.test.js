import {expect} from "chai";
import {find_annotation_in_manifest} from "@kshell/manifesto-prezi4";
import * as manifesto from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


let manifest_json  = null;
 
before(function(){
    const manifest_path = './test/fixtures/10_activating_annotations/whale_comment_activating_annotation.json';
    manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
});
               

describe('query Manifest.Annotations property', function(){
    let annotations = null;
    it('find annotations', function() {
        expect(manifest_json).to.exist; 
        const manifest = manifesto.buildManifest(manifest_json);
        expect(manifest).to.be.instanceOf(manifesto.Manifest);
        //const page = manifest.Annotations[0];
        //expect(page).to.exist;
        annotations = manifest.Annotations.reduce((acc,page) => {
            return acc.concat( page.Items);
        },[]);
        
        expect(annotations).to.have.lengthOf(4); 
    });
    
    it("check motivations in Manifest.Annotations", function(){
        expect(annotations).to.exist;
        annotations.forEach( (anno) => {
            expect(["commenting", "activating"]).to.include( anno.Motivation[0]);
        });
    });
});

