import {expect} from "chai";
import * as manifesto from "@kshell/manifesto-prezi4";
import * as fs from "node:fs";


let annotation_data  = null;
 
before(function(){
    const manifest_path = './test/fixtures/4_transform_and_position/model_transform_rotate_translate_position.json';
    const manifest_json = JSON.parse( fs.readFileSync(manifest_path, 'utf8'));
    annotation_data = manifest_json?.items[0]?.items[0]?.items[0];
});
               
describe('model_transform_rotate_translate_position.json', function() {
    let annotation = null; 
    let target = null;
    let body = null;
    
    it('annotation loads', function() {
        expect(annotation_data).to.exist; 
        const annotation_resource = manifesto.ResourceOps.cast_to_resource(annotation_data);
        annotation = manifesto.JSONLDResource.Construct(annotation_resource);
        expect(annotation).to.exist;
        expect(annotation.isAnnotation).to.equal(true);
    });
    
    it('body loads from annotation', function(){
        if (annotation == null) this.skip();
        body = annotation.Body;
        expect(body).to.exist;
    });
    
    
    describe("body resource", function(){
        
        let specific_resource = null;
        let transforms = null;
        let model = null;
         
        it("is a SpecificResource", function(){
            if (body == null) this.skip();
            expect(body.isSpecificResource).to.equal(true);
            specific_resource = body;
        });
        
        it('with transforms', function(){
            if (specific_resource == null ) this.skip();
            transforms = specific_resource.Transform;
            expect(transforms).to.be.an('array');
            expect(transforms).to.have.lengthOf(2);
        });
        
        it('with no selector', function(){
            if (specific_resource == null ) this.skip();
            const selector = specific_resource.Selector;
            expect(selector).to.equal(null);
        });
        it('source is a model', function(){
            if (specific_resource == null ) this.skip();
            model = specific_resource.Source;
            expect(model).to.exist;
            expect(model.isModel).to.equal(true);
        });
    });
    
    it('target loads from annotation', function(){
        if (annotation == null) this.skip();
        target = annotation.Target;
        expect(target).to.exist;
    });

    describe("target resource", function(){
        let specific_resource = null;
        let source = null;
        let point_selector = null;
 
        it("is a SpecificResource", function(){
            if (target == null) this.skip();
            expect(target.isSpecificResource).to.equal(true);
            specific_resource = target;
        });
        
        it("with a PointSelector", function(){
            if (specific_resource == null) this.skip();
            const ps = specific_resource.Selector;
            expect(ps.isPointSelector).to.equal(true);
            point_selector = ps;
        });
        
        it("with coordinates", function(){
            const coordinates = point_selector.Components;
            expect(coordinates).to.be.an('array');
            expect(coordinates).to.have.lengthOf(3);
        });
       
        it("and Scene as source", function(){
            const scene = specific_resource.Source;
            expect(scene.isScene).to.equal(true);
        })
        
    });
    
});