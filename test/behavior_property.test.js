import {expect} from "chai";
import {find_annotation_in_manifest} from "@kshell/manifesto-prezi4";
import * as manifesto from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


let manifest_json  = null;
 
before(function(){
    const manifest_path = './test/fixtures/10_activating_annotations/whale_comment_activating_annotation.json';
    manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
});
               

describe('query Annotation behavior property', function(){
    let annotation = null;
    it('find annotation', function() {
        expect(manifest_json).to.exist; 
        const manifest = manifesto.buildManifest(manifest_json);
        expect(manifest).to.be.instanceOf(manifesto.Manifest);
        const anno_id = "https://example.org/iiif/3d/anno6";

        const found = manifest.findAnnotationById(anno_id);
        expect(found).to.exist;
        expect(found.isAnnotation).to.equal(true);
        expect(found.ResourceId).to.equal(anno_id);
        annotation = found;        
    });
    
    it('query behavior property', function(){
        const behavior = annotation.Behavior;
        expect(behavior).to.exist;
        expect(behavior).to.be.instanceOf(Array);
        expect(behavior).to.have.length(1);
        expect(behavior.includes("hidden")).to.equal(true);
    });


});

describe('query Annotation behavior with no json property', function(){
    let annotation = null;
    it('find annotation', function() {
        expect(manifest_json).to.exist; 
        const manifest = manifesto.buildManifest(manifest_json);
        expect(manifest).to.be.instanceOf(manifesto.Manifest);
        const anno_id = "https://example.org/iiif/3d/anno2";

        const found = manifest.findAnnotationById(anno_id);
        expect(found).to.exist;
        expect(found.isAnnotation).to.equal(true);
        expect(found.ResourceId).to.equal(anno_id);
        annotation = found;        
    });
    
    it('query behavior property', function(){
        const behavior = annotation.Behavior;
        expect(behavior).to.exist;
        expect(behavior).to.be.instanceOf(Array);
        expect(behavior).to.have.length(0);
        expect(behavior.includes("hidden")).to.equal(false);
    });


});