var mainQueue = [
    {
        name: "Aloe Vera Handwashing Gel",
        taxons: ["skincare", "organic"],
        section: "summer-collection",
        best_seller_idx: 2,
        new_arrival_idx: 4
    },
    {
        name: "COSRX BHA Toner",
        taxons: ["skincare", "skincare/face", "skincare/face/toners"],
        section: "face-care",
        best_seller_idx: 3,
        new_arrival_idx: 5
    },
    {
        name: "Facial Care BHA Wash",
        taxons: ["skincare", "skincare/face", "skincare/face/wash"],
        section: "face-care",
        best_seller_idx: 4,
        new_arrival_idx: 1
    },
    {
        name: "Orange Peel Masks",
        taxons: ["skincare", "skincare/face", "skincare/face/masks"],
        section: "summer-collection",
        best_seller_idx: 5,
        new_arrival_idx: 2
    },
    {
        name: "Cucumber Peel Masks",
        taxons: ["skincare", "skincare/face", "skincare/face/masks"],
        section: "face-care",
        best_seller_idx: 1,
        new_arrival_idx: 3
    }
];

var rules = [
    ["face-care-check", 2],
    ["summer-collection-check", 2],
    ["face-care-check", 1],
]

var x = [1,2,3]
var queuer = $kq(mainQueue, rules);
queuer.addFilterFunction("face-care-check", function(elem){
    return elem.section === 'face-care'
}, true)

queuer.addFilterFunction("summer-collection-check", function(elem){
    return elem.section === 'summer-collection'
}, true)

var results = queuer.run();