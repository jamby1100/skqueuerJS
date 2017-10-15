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

(1) Define your `mainQueue` and your `rules` variable. Your `mainQueue` is where you'd get your elements from. They must be objects with attributes and must have a unique ID. Your `rules` variable is how you define the ordering of your elements based on a certain criteria. You will define the criteria (and how it distinguishes elements) on Part (2).
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
Filter functions are functions that tell the library whether a certain element satisfies a given criteria or not. You can either use the automatedFunctionGenerator I've built (3A) or you can define your own (3B).

You have to use the `queuer.addFilterFunction()` method to add filter functions to your queuer. You have to specify a name for your filter function (as specified in your rules variable) and the function your importing as your first and second parameters respectively.

(3A) Generate Filter Functions
```javascript
    var a = queuer.automatedFunctionGeneratorModule(rules2);
    
    queuer.addFilterFunction("equal_section_to_face-care", a["equal_section_to_face-care"])
    queuer.addFilterFunction("equal_section_to_summer-collection", a["equal_section_to_summer-collection"])
```

There is a format in creating a string that the library can parse to generate a function for you. We call this string the `operatorString`. A sample can be: `equal_section_to_face-care`

The system divides this string into two: The `conditionString` (in this case `equal_section`) and the `comparatorValue` (in this case `face-care`).

The `conditionString` is further divided into three parts: the operator (in this case, `equal`), the attribute (in this case, `section`, the filter function is given an element for which it gets the `section` attribute of that element to get the `valueToBeCompared`), and the `conjunctiveStatement` which is optional (more on this later. For this case, it has no conjunctive statement).

(3B) Create your own filter functions
Custome filter function must return either a true or a false.
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

## Wishlist of Features
SkqueuerJS is divided into 2 Primary Modules. If you have spare time and enough JavaScript skills, feel free to work on these features and send me a pull request! :D

### Automated Function Factory
- Allow the checking of attributues within nested objects inside an element
- Support for arrays and numbers (and hence greater-than, less-than and other number comparison operators) for an element.
- Support for contained in string `comparatorValue`
- Support for an array of `comparatorValue`s
- Support for an object `comparatorValue`

### Queue Module
- Validations
    - Unique ID
    - Check if filter function:
        - is a function
        - has one parameter
        - returns a true/false given one sample element from mainQueue
        - is on the rules
- How many elements do you want to come out?
    - Constant: I want 100 Elements
    - Iterations: Run the rule set for 5 iterations
    - Black Out: Ensure that every single element in the this.mainQueue gets used
- What to do when an element gets eligible for 2 rules
    - Default: Do not allow duplicated elements
    - AllowDuplicate: Allow duplicated elements
- Start the queueing from:
    - RIGHT
    - LEFT (default)


