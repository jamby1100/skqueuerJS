# Skqueuer JS

A Javascript library designed to help you create an arrangement of items based on any given criteria. Edit
Add topics

## Usage

### Installation
Plug in to your HTML File via the script tag. Remember to make the lodash script tag _first_
```html
<script src="lodash.js"></script>
<script src="Skqueuer.js"></script>
<script src="app.js"></script>
```
### Usage

(1) Define your mainQueue. This is where you'd get elements from:
```javascript
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

    var rules2 = [
        ["equal_section_to_face-care", 2],
        ["equal_section_to_summer-collection", 2]
    ]; 
```

(2) Initialize Skqueuer
```javascript
    var queuer = $kq(mainQueue, rules2);
```

(3) Add Filter Functions

(3A) Generate Filter Functions
```javascript
    var a = queuer.automatedFunctionGeneratorModule(rules2);
    
    queuer.addFilterFunction("equal_section_to_face-care", a["equal_section_to_face-care"])
    queuer.addFilterFunction("equal_section_to_summer-collection", a["equal_section_to_summer-collection"])
```

(3B) Create your own filter functions
```javascript
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

```

(4) Run the Queuer Algorithm
```javascript
    var results = queuer.run();
```

## Structure
SkqueuerJS is divided into 2 Modules

### Automated Function Factory
You can generate a function just by creating strings.
### Queue Module

