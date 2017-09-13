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
    var validateFilterFunctions = function(rules, filterFunctions) {
        // 
        var rule_function_calls = _.uniq(_.map(rules, function(r){ return _.nth(r, 0)}).sort());
        var filter_function_names = Object.keys(filterFunctions).sort();

        return _.isEqual(rule_function_calls, filter_function_names);
    };
    
    var deriveMultiQueue = function (mainQueue, filterFunctions) {
      var multiQueue = {}
      
      _.each(filterFunctions, function(filterFunction, functionName) {
          console.log(functionName);
          multiQueue[functionName] = _.filter(mainQueue, filterFunction);
      });
        
      return multiQueue;
    };
    
    // TODO
    // - Add support when mainQueue is more than the sum of the rules -- DONE
    // - Add support for interlapping multiQueue sets -- DONE
    
    var validator = function(results, element) {
        return _.includes(_.flatten(results), _.first(element))
    }
    
    var alternatorCoreFunction = function(multiQueue, rules, maxLength) {
        var results = []
        var multiQueueCopy = _.cloneDeep(multiQueue)

        // For each rule, fetch elements from appropriate queue in multiQueue
        
        do {
            _.each(rules, function(rule_set) {
              var functionName = rule_set[0];
              var items = rule_set[1];

              for (i = 0; i < items; i++) {
                  // Go to the next iteration if this multiqueue is empty
                  if (multiQueueCopy[functionName].length === 0) {
                      continue;
                  }
                  
                  // for this ruleset, continously pop off elements from the current
                  // queue until the result is not a duplicate in results
                  var element = null;
                  do {
                    element = multiQueueCopy[functionName].splice(0,1);
                  } while (validator(results, element));

                  results.push(element);              
              }
            });            
        } while (!(results.length >= maxLength))
        
        return results;
    }
    
    var blackOutAlternatorCoreFunction = function(multiQueue, rules) {
        // 
    }
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
            if (validateFilterFunctions(this.rules, this.filterFunctions)) {
                smartConsole("validateFilterFunctions true");
            } else {
                smartConsole("validateFilterFunctions failed");
            };
            
            var runMode = mode || "blackOut"
            
            var multiQueue = deriveMultiQueue(this.mainQueue, this.filterFunctions);    
            var resultingQueue = alternatorCoreFunction(multiQueue, this.rules, this.mainQueue.length);
            
            
            return _.flatten(resultingQueue);   
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