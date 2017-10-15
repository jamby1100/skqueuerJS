;(function (global, _) {
    // -- PRIMARY INITIALIZER
    var Skqueuer = function(mainQueue, rules){
        return new Skqueuer.init(mainQueue, rules)
    };
    
    var smartConsole = function(text){
        console.log("--");
        
        for(var arg = 0; arg < arguments.length; ++ arg)
        {
            var arr = arguments[arg];
            console.log(arr);
        }
        console.log("--");
    }
    
    // -- PRIVATE METHODS
    // -- The private methods has no access to the 'this' so better to pass it as params
    
    var generalHelpers = {
        getRuleFunctionNamesFrom: function(rules) {
            return _.uniq(_.map(rules, function(r){ return _.nth(r, 0)}).sort());
        }
    };

    var validationModule = {
        // Validate that all functions mentioned in the rules are available
        filterFunctions: function(rules, filterFunctions) {
            var rule_function_calls = generalHelpers.getRuleFunctionNamesFrom(rules);
            var filter_function_names = Object.keys(filterFunctions).sort();

            return _.isEqual(rule_function_calls, filter_function_names);
        }
    }
    
    var queueModule = {
        deriveMultiQueue: function (mainQueue, filterFunctions) {
            var multiQueue = {}

            _.each(filterFunctions, function(filterFunction, functionName) {
              console.log(functionName);
              multiQueue[functionName] = _.filter(mainQueue, filterFunction);
            });

            return multiQueue;
        },  
        validator: function(results, element) {
            return _.includes(_.flatten(results), _.first(element))
        },
        fetchRuleEligibleElements: function(rule_set, results, multiQueueCopy) {
            var functionName = rule_set[0];
            var items = rule_set[1];
            var self = this; // for my sanity

            for (i = 0; i < items; i++) {
              // (1) Go to the next iteration if this multiqueue is empty
              if (multiQueueCopy[functionName].length === 0) {
                  continue;
              }

              // (2) for this ruleset, continously pop off elements from the current
              //     queue until the result is not a duplicate in results
              //        - What happens when the set runs out? Will we return the
              //        last duplicated element?
              var element = null;
              do {
                element = multiQueueCopy[functionName].splice(0,1);
              } while (self.validator(results, element));
                
              // (3) Push element to the result
              results.push(element);              
            }

            return [results, multiQueueCopy];
        },
        alternatorCoreFunction: function(multiQueue, rules, maxLength) {
            debugger;
            var results = [];
            var multiQueueCopy = _.cloneDeep(multiQueue);
            var self = this; // for my sanity

            // Do until the results equal or greater than the maxLength
            do {
                // For each rule, fetch elements from appropriate queue in multiQueue
                _.each(rules, function(rule_set) {
                    var resultingHash = self.fetchRuleEligibleElements(rule_set, results, multiQueueCopy);

                    result = resultingHash[0];
                    multiQueueCopy = resultingHash[1];
                });            
            } while (!(results.length >= maxLength))

            return results;
        }
    };
    
    // operatorString:
    // parsedDigest: 
        // conditionalSet
            // [0] comparatorStatement
            // [1] elementKey
            // [2] conjunctionStatement
    
    var automatedFunctionFactory = {
        // Format
        // INPUT (operatorString): equal_valueOne_and_includes_valueTwo_or_equal_valueThree_to_jamby
        // OUTPUT (parsedDigest & comparatorValue): [ ["equal", "valueOne", "and"], ["includes", "valueTwo", "or"], ["equal", "valueThree"] ]
        
        // INPUT: ["equal_section_to_face-care", "equal_section_to_summer-collection"]
        parser: function(operatorStringSet) {
            var parsedDigestSet = {}
            
            _.each(operatorStringSet, function(operatorString) {
                var components = operatorString.split("_to_");
                var comparatorValue = components[1];
                var parsedDigest = _.chunk(components[0].split("_"), 3);
                parsedDigestSet[operatorString] = {parsedDigest: parsedDigest, comparatorValue: comparatorValue}
            });
            
            return parsedDigestSet;
        },
        
        core: function(parsedDigest) {
            return function(element) {
                var currentTruthValue = true
                var currentConjunctiveStatement = false;
                var comparatorValue = parsedDigest["comparatorValue"];

                // A parsedDigest is composed of multiple conditionalSet(s) 
                // For each conditionalSet, we evaluate its logicalValue
                // SAMPLE SET: ["equal", "valueOne", "and"]
                _.each(parsedDigest["parsedDigest"], function(conditionalSet) {
                    // (1) Initialize Variables
                    var operator = conditionalSet[0];
                    var logicalValue = false;
                    var valueToBeCompared = element[conditionalSet[1]];
                    
                    // (2) Evaluate current conditionalSet
                    switch (operator) {
                        case "equal":
                            logicalValue = _.includes(comparatorValue, valueToBeCompared);
                            break;
                        case "includes":
                            // logicalValue = _.includes(_.flatten(results), _.first(element))
                            break;
                        default:
                    }
                    
                    // (3) Evaluate in relation with its conjunction statement
                    switch (currentConjunctiveStatement) {
                        case false:
                            currentTruthValue = logicalValue
                            break;
                        case 'and':
                            currentTruthValue = currentTruthValue && logicalValue
                            break;
                        case 'or':
                            currentTruthValue = currentTruthValue || logicalValue
                            break;
                    };
                    
                    // (4) redefine the next currentConjunctiveStatement
                    currentConjunctiveStatement = conditionalSet[2] || false;
                });
                
                return currentTruthValue;
            }
        }
    }
    
    // TODO
    // - Add support when mainQueue is more than the sum of the rules -- DONE
    // - Add support for interlapping multiQueue sets -- DONE

    // -- PUBLIC METHODS
    Skqueuer.prototype = {
        // Add Filtering Functions
        
        // TODO
        // - Check if fx is a function
        // - Check if fx has one parameter
        // - Check if fx returns a true/false given one sample element from mainQueue
        // - Check if fx is on the rules
        
        addFilterFunction: function(fx_name, fx, replace_forced){
            var replace_forced = replace_forced || false
            if ((this.filterFunctions[fx_name] === undefined) || (replace_forced === true) ) {
                this.filterFunctions[fx_name] = fx;
            } else {
                throw "addFilterFunction: The function" + fx_name + "() is already defined. Add replaced_forced parameter true to force replace";
            };
        },
        
        // Run the Queueing Mechanism
        // TODO
        // - How many elements do you want to come out?
        //      - Constant: I want 100 Elements
        //      - Iterations: Run the rule set for 5 iterations
        //      - Black Out: Ensure that every single element in the this.mainQueue gets used
        // - What to do when an element gets eligible for 2 rules
        //      - Default: Do not allow duplicated elements
        //      - AllowDuplicate: Allow duplicated elements
        // - Start the queueing from:
        //      - RIGHT
        //      - LEFT (default)
        run: function(mode) {  
            if (validationModule.filterFunctions(this.rules, this.filterFunctions)) {
                smartConsole("validateFilterFunctions true");
            } else {
                smartConsole("validateFilterFunctions failed");
            };
            
            var runMode = mode || "blackOut"
            
            var maxLength = null;
            if (runMode === "blackOut") {
                maxLength = this.mainQueue.length    
            } else {
                
            }
            
            var multiQueue = queueModule.deriveMultiQueue(this.mainQueue, this.filterFunctions);    
            var resultingQueue = queueModule.alternatorCoreFunction(multiQueue, this.rules, maxLength);
            
            
            return _.flatten(resultingQueue);   
        },
    
        // queuer.automatedFunctionGeneratorModule.initialize(rules)
        automatedFunctionGeneratorModule: function(rules) {
            var rule_function_calls = generalHelpers.getRuleFunctionNamesFrom(rules);
            var parsedDigestSet = automatedFunctionFactory.parser(rule_function_calls);
            debugger;
            var result = {}
            _.forOwn(parsedDigestSet, function(value, key) {result[key] = automatedFunctionFactory.core(value) } )
            
            return  result;
        }
        
    };
    
    // -- FUNCTION CONSTRUCTOR
    Skqueuer.init = function(mainQueue, rules) {
        var self = this;
        
        self.filterFunctions = {};
        self.mainQueue = mainQueue || [];
        self.rules = rules || [];
        self.flames = {};
        
        
        return this;
    }
    
    // -- ASSIGN PUBLIC METHODS TO PROTOTYPE
    Skqueuer.init.prototype = Skqueuer.prototype;
    
    // -- INSERT LIBRARY TO GLOBAL OBJECT
    global.Skqueuer = global.$kq = Skqueuer;
}(window, _));