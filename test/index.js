


describe.skip('core tests', function(){
    require('./tests/core_tests/parse_manifest.js');
    require('./tests/core_tests/class_color.js');
    require('./tests/core_tests/annotationIdMap.js');
    require('./tests/core_tests/iiif_label.js');
});

describe("1_basic_model_in_scene" , function(){
    require('./tests/1_basic_model_in_scene/model_origin.js');
});

describe("4_transform_and_position" , function(){
    require('./tests/4_transform_and_position/model_transform_rotate_translate_position.js');
});

