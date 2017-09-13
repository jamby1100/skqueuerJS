var mainQueue = [
    {
        id: 1,
        name: "Aloe Vera Handwashing Gel",
        taxons: ["skincare", "organic"],
        section: "summer-collection",
        best_seller_idx: 2,
        new_arrival_idx: 4
    },
    {
        id: 2,
        name: "COSRX BHA Toner",
        taxons: ["skincare", "skincare/face", "skincare/face/toners"],
        section: "face-care",
        best_seller_idx: 3,
        new_arrival_idx: 5
    },
    {
        id: 3,
        name: "Facial Care BHA Wash",
        taxons: ["skincare", "skincare/face", "skincare/face/wash"],
        section: "face-care",
        best_seller_idx: 4,
        new_arrival_idx: 1
    },
    {
        id: 4,
        name: "Orange Peel Masks",
        taxons: ["skincare", "skincare/face", "skincare/face/masks"],
        section: "summer-collection",
        best_seller_idx: 5,
        new_arrival_idx: 2
    },
    {
        id: 5,
        name: "Cucumber Peel Masks",
        taxons: ["skincare", "skincare/face", "skincare/face/masks"],
        section: "face-care",
        best_seller_idx: 1,
        new_arrival_idx: 3
    }
];

// -- FIRST RULE SAMPLES
//    var rules = [
//        ["face-care-check", 2],
//        ["summer-collection-check", 2],
//        ["face-care-check", 1],
//    ]
//
//    var x = [1,2,3]
//    var queuer = $kq(mainQueue, rules);
//    queuer.addFilterFunction("face-care-check", function(elem){
//        return elem.section === 'face-care'
//    }, true)
//
//    queuer.addFilterFunction("summer-collection-check", function(elem){
//        return elem.section === 'summer-collection'
//    }, true)
//
//    var results = queuer.run();

// -- SECOND RULE SAMPLES
    var rules = [
        ["skin-care-taxon-check", 2], // 1,2,3,4,5
        ["summmer-collection-section-check", 1], // 1,4
        ["face-care-section-check", 1] // 2,3,5
    ]; 

    // Correct Result => 1,2,4,3,5
    // Distorted => 1,2,4,3,5
    // Pseudo Result => 1,1,2

    var queuer = $kq(mainQueue, rules);
    queuer.addFilterFunction("face-care-section-check", function(elem){
        return elem.section === 'face-care';
    }, true)

    queuer.addFilterFunction("summmer-collection-section-check", function(elem){
        return elem.section === 'summer-collection';
    }, true)

    queuer.addFilterFunction("skin-care-taxon-check", function(elem){
      return _.filter(elem.taxons, function(taxon){
          return taxon === 'skincare'
      }).length > 0
    })

    var results = queuer.run();