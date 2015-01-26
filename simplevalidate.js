var ruleCategory = {
	required: "required",
	minlength: "minlength",
	maxlength: "maxlength"
};

//ckeditor validation callback function
var ckeditorCallback = function(el){
	//implement the validation for ckeditor
}

//can add others
var validateCallback = {
	"ckeditor": ckeditorCallback	
}

var validate = (function(fun){
	return {
		//do the validation
		doValidation: function(el, callback){
			if(!callback){
				callback = fun;
			}
			if(typeof callback === "function"){
				callback(el);
			}else{
				for(var i in callback){
					if(typeof callback[i] === "function")
						callback[i](el);
				}
			}
		},
		
		doMultiValidation: function(els, applyone, callbacks){
			if(!callbacks){
				callbacks = fun;
			}
			if(applyone){
				if($.isArray(els)){
					console.log("only can pass one element for validation");
					return;
				}
				for(var i in callbacks){
					this.doValidation(els, callbacks[i]);
				}
			}else{
				if(!$.isArray(els)){
					els = [els];
				}
				for(var i in els){
					var el = els[i];
					this.doValidation(el, callbacks[el]);
				}
			}	
		}
	};
})(validateCallback);
