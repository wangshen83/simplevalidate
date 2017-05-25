(function ($) {
	//begin the validator
	var validator = {
		regexObj : {
			"email" : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
			"age" : /^((\d+)|(0+))$/,
			"english" : /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]*$/
		},

		showhideErrorMsg : function(el, callback, msg) {
			if (!el) {
				return;
			}
			if (!msg) {
				msg = "";
			}
			callback.call(this, el, msg);
		},

		addError : function(el, msg) {
			if (!el.parent().parent().hasClass("fx-error")) {
				el.closest("div").addClass("fx-error");
				el.wrap("<div class='fx-inputwrap'></div>").after("<div class='fx-error-resolution'>" + msg + "</div>");
			}
		},

		removeError : function(el, msg) {
			if (el.parent().parent().hasClass("fx-error")) {
				el.unwrap().siblings(".fx-error-resolution").remove();
				el.closest("div").removeClass("fx-error");
			}
		},

		normalChecker : function(el, msg, regexStr) {
			var value = $("input[name='" + el + "']").val();
			var isvalid;
			if (!regexStr) {
				isvalid = $.trim(value).length > 0;
			} else {
				isvalid = regexStr.test(value);
			}
			if (!isvalid) {
				this.showhideErrorMsg($("input[name='" + el + "']"), function(el, msg) {
					this.addError(el, msg);
				}, msg);
			} else {
				this.showhideErrorMsg($("input[name='" + el + "']"), function(el, msg) {
					this.removeError(el, msg);
				}, msg);
			}
			return isvalid;
		},

		emailChecker : function(el) {
			return this.normalChecker(el, "Please provide valid email address", this.regexObj["email"]);
		},

		ageChecker : function(el) {
			return this.normalChecker(el, "Please provide valid age", this.regexObj["age"]);
		},

		requiredChecker : function(el) {
			return this.normalChecker(el, "Please enter required field");
		},

		englishonlyChecker : function(el) {
			return this.normalChecker(el, "Please only input English", this.regexObj["english"]);
		}
	};
	//end the validator

	//validate call the certain validator to do the validation
	var validate = (function() {
		return {
			doValidation : function(el, callback) {
				if ( typeof callback === "function") {
					return callback.call(validator, el);
				} else {
					var result = [];
					for (var i in callback) {
						if (callback.hasOwnProperty(i)) {
							if ( typeof callback[i] === "function")
								result.push(callback[i].call(validator, el));
						}
					}
					return result;
				}
			},

			doMultiValidation : function(els, applyone, callbacks) {
				var result = [];
				if (applyone) {
					if ( typeof callbacks !== "function") {
						callbacks = callbacks[0];
					}
					for (var i in els) {
						if (els.hasOwnProperty(i)) {
							result.push(this.doValidation(els[i], callbacks));
						}
					}
				} else {
					if (!$.isArray(els)) {
						els = [els];
					}
					for (var i in els) {
						if (els.hasOwnProperty(i)) {
							var el = els[i];
							result.push(this.doValidation(el, callbacks[el]));
						}
					}
				}
				return result;
			}
		};
	})();

	$.validate = validate;
	$.validator = validator;
})(jQuery);
