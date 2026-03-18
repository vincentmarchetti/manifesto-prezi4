import {expect} from "chai";
import * as manifesto from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";
           
describe('model_origin.json', function() {
    let manifest, scene, annotation    
    
    it('loads', function() {
        const manifest_path = './test/fixtures/1_basic_model_in_scene/model_origin.json';
        const manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
        manifest = manifesto.buildManifest(manifest_json);
        expect(manifest).to.be.instanceOf(manifesto.Manifest);
    });

    it('has one scene', function() {
        if (manifest == null ) this.skip();
        const items = manifest.Items;
        expect(items).to.have.lengthOf(1);
        scene = items[0];
        expect(scene.isScene).to.equal(true);
    });

    it('has one annotation', function() {
        if ( scene == null) this.skip();
        const allAnnotation = scene.Items.flatMap( (page) => page.Items );
        expect(allAnnotation).to.have.lengthOf(1);
        annotation=allAnnotation[0];
    });
    
    it('annotation body', function(){
        if (annotation == null) skip();
        const body=annotation.Body;
        expect( body.isModel ).to.equal(true);
        expect( body ).to.be.instanceOf(manifesto.Model);
    });
    
    it('annotation target', function(){
        if (annotation == null) skip();
        const body=annotation.Target;
        expect( body.isScene ).to.equal(true);
        expect( body ).to.be.instanceOf(manifesto.Scene);
    });
});

describe('model_origin_bgcolor', function() {
    let manifest, scene
    it('loads', function() {
        const manifest_path = './test/fixtures/1_basic_model_in_scene/model_origin_bgcolor.json';
        const manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
        manifest = manifesto.buildManifest(manifest_json);
        expect(manifest).to.be.instanceOf(manifesto.Manifest);
    });

    it('has one scene', function() {
        if (manifest == null ) this.skip();
        const items = manifest.Items;
        expect(items).to.have.lengthOf(1);
        scene = items[0];
        expect(scene.isScene).to.equal(true);
    });


    
    it('with a defined background color', function(){
        const  backgroundColor = scene.BackgroundColor;
        expect(backgroundColor).to.exist;
        expect(backgroundColor.red).to.equal(255);
        expect(backgroundColor.green).to.equal(0);
        expect(backgroundColor.blue).to.equal(254);
    });
});


