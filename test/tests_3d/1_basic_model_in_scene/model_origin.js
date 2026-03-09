var expect = require('chai').expect;
var should = require('chai').should();
var manifesto = require('../../../dist-commonjs/');
var ExternalResourceType = require('@iiif/vocabulary/dist-commonjs/').ExternalResourceType;
var MediaType = require('@iiif/vocabulary/dist-commonjs/').MediaType;

const fs = require('node:fs');

                      
describe('model_origin.json', function() {
    let manifest, scene, annotation    
    
    it('loads', function() {
        const manifest_path = './test/fixtures/1_basic_model_in_scene/model_origin.json';
        manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
        manifest = manifesto.buildManifest(manifest_json);
        expect(manifest).to.be.instanceOf(manifesto.Manifest);
    });

    it('has one scene', function() {
        if (manifest == null ) this.skip();
        items = manifest.Items;
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
