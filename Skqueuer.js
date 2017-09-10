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
    // - Add support when mainQueue is more than the sum of the rules
    var alternatorCoreFunction = function(multiQueue, rules) {
        results = []
        var multiQueueCopy = _.cloneDeep(multiQueue)

        // For each rule, fetch elements from appropriate queue in multiQueue
        _.each(rules, function(value) {
          var functionName = value[0];
          var items = value[1];
        
          results.push(multiQueueCopy[functionName].splice(0,items));  
        });
        
        return results;
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
        run: function() {
            if (validateFilterFunctions(this.rules, this.filterFunctions)) {
                smartConsole("validateFilterFunctions true");
            } else {
                smartConsole("validateFilterFunctions failed");
            };
            
            var multiQueue = deriveMultiQueue(this.mainQueue, this.filterFunctions);
            var resultingQueue = alternatorCoreFunction(multiQueue, this.rules);
            
            
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