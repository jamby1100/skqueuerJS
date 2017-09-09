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
    var validateFilterFunctions =  function(rules, filterFunctions) {
        // Collect all method names required by the rules
        var rule_function_calls = _.uniq(_.map(rules, function(r){ return _.nth(r, 0)}).sort());
        var filter_function_names = _.uniq(Object.keys(filterFunctions).sort());
        
        // Does self.rules have all the function it needs to function?
        smartConsole(rule_function_calls, filter_function_names)

        return _.isEqual(rule_function_calls, filter_function_names);


        return true;
    };
    // TODO
    // - Add support when mainQueue is more than the sum of the rules
    var alternatorCoreFunction = function(mainQueue, rules, filterFunctions) {
        // 1. Apply the filterFunctions to each element of the mainQueue
        // in order to filter the eligible elements 
        
        // 2. For each rule, fetch elements
        _.each(rules, function(value) {
          var filterFunctionName = value[0];
          var items = value[1];
            
          
        })
    }
    
    // -- PUBLIC METHODS
    Skqueuer.prototype = {
        // Add Filtering Functions
        // TODO
        // - Check if fx is a function
        // - Check if fx has one parameter
        // - Check if fx returns a true/false given one sample element from mainQueue
        addFilterFunction: function(fx_name, fx, replace_forced){
            var replace_forced = replace_forced || false
            if ((this.filterFunctions[fx_name] === undefined) || (replace_forced === true) ) {
                this.filterFunctions[fx_name] = fx;
            } else {
                throw "addFilterFunction: The function" + fx_name + "() is already defined. Add replaced_forced parameter true to force replace";
            };
        },
        run: function() {
            if (validateFilterFunctions(this.rules, this.filterFunctions)) {
                smartConsole("validateFilterFunctions true");
            } else {
                smartConsole("validateFilterFunctions failed");
            }
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