(function($) {
	$.extend($.fn, {
		validate: function(options){
			var elements = [];
			if(!$.isArray(this)){
				var that = this;
				elements.push(that);
			}else{
				for(var i in this){
					elements.push($(this[i]));
				}
			}	
			return new $.validator(elements, options);
		}
	});

	$.validator = function(elements, options){
		this.settings = $.extend(true, {}, $.validator.defaultSettings, options);
		this.currentElements = elements;
		this.errorList = [];
		this.initValidate();
	}

	$.extend($.validator, {
		//default settings for the validator
		defaultSettings: {
			methods: methods,
			messages: messages,
			ruleList: defaultRules
		},
		
		//can add validate method to extend
		addMethod: function(name, callback, message){
			$.validator.settings.methods[name] = callback;
			$.validator.settings.messages[name] = message !== undefined ? message : $.validator.settings.messages[name];
		},
		
		//can add rules to extend
		addRules: function(name, callback, params, message){
			this.addMethod(name, callback, message);
			$.validator.settings.ruleList[name] = {
				validateMethod: callback,
				params: params
			}
		},
		
		//init validation, called at the first place
		initValidate: function(){
			if(!this.currentElements && this.currentElements.length == 0){
				console.log("Please select elements to do the validation!");
				return;
			}	
			this.addValidateElements(this.currentElements, this.settings.ruleList);
			this.doValidation();
		},
		
		//provide method to dynamically add elements to validate
		addValidateElements: function(els, rules){
			var len = els.length;
			if(len == 0){
				console.log("Please init with elements!");
				return;
			}
			for(var i = 0; i < len; i++){
				if(this.errorList){
					this.errorList.push({
						element: els[i],
						rules: rules
					});
				}
			}
		},
			
		//remove a validate element dynamically
		removeValidateElement: function(el){
			if(this.errorList.length != 0){
				for(var i = 0; i < this.errorList.length; i++){
					var element = this.errorList[i].element;
					if(element === el)
						this.errorList.splice(i, 1);
				}
			}
		},
		
		//the function to do the validation, need to call 
		//showErrors or hideErrors according to the result
		doValidation: function(){
			if(this.errorList.length != 0){
				for(var i = 0; i < this.errorList.length; i++){
					var el = this.errorList[i].element;
					var elementValue = this._getElementValue(el);
					var rules = this.errorList[i].rules;
					$.each(rules, function(key, obj){
						var fun = obj.validateMethod;
						var params = obj.params;
						var result = fun.call(this, el, elementValue, params);
						if(!result){
							this._showErrors(el, this.settings.messages[key]);
						}else{
							this._hideErrors(el);
						}
					});		
				}
			}
		},
		
		//private method, get the element value according to element type
		_getElementValue: function(element){
			if(!element instanceof jQuery){
				element = $(element);
			}
			var tagname = element.prop("tagName");
			var type = "";
			if(tagname == "INPUT"){
				type = element.attr("type");
			}
			var value = element.val();
			switch (type){
				case "radio":
				case "checkbox":
					value = $("input[name=" + element.attr('name') + "]:checked").val();
					break;
				default:
					value = element.val();
			}
			return $.trim(value);
		},
		
		//private method, display errors when it is not validate
		_showErrors: function(element, errorMessage){
			var errorHtml = "<div class=\"errorTip\">" + errorMessage + "</div>";
			element.after(errorHtml);
		},
		
		//private method, hide the errors when it is OK
		_hideErrors: function(element){
			var errorWidget = element.parent.find(".errorTip");
			if(errorWidget.html() != null)
				errorWidget.remove();
		},
			
		//format some displaying messages
		format: function(message, params){
			if(!$.isArray(params))
				params = [params];
			
			$.each(params, function(i, n){
				message = message.replace(new RegExp("\\{" + i + "\\}", "g"), function(){
					return n;
				});
			});
		}
	});

	//some default methods which can be applied automatically
	var defaultMethods = {
		min: function(element, value, param) {
			if($.isArray(param))
				param = param[0];
			return value >= param;
		},

		max: function(element, value, param) {
			if($.isArray(param))
				param = param[0];
			return value <= param;
		},
		
		required: function(element, value, param){
			return $.trim(value).length > 0;
		}
	}

	//all validate methods, can add new one by calling addMethod
	var methods = $.extend(defaultMethods, {
	});

	//default rules applying to the object
	var defaultRules = {
		min: {
			validateMethod: methods["min"],
			params: [10]
		},
		
		max: {
			validateMethod: methods["max"],
			params: [100]
		},
		
		required: {
			validateMethod: methods["required"],
			params: []
		}
	}

	//some default messages, can add new one by calling addMethod
	var messages = {
		required: "This field is required.",
		max: $.validator.format( "Please enter a value less than or equal to {0}." ),
		min: $.validator.format( "Please enter a value greater than or equal to {0}." )
	};

})(jQuery);