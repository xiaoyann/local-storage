/**
 * A wrapper of localStorage for support expires.
 * And every operating is asynchronous.
 */
;(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
    	define([], factory);
  	} else if (typeof exports === 'object') {
    	module.exports = factory(root);
  	} else {
    	root.localStore = factory(root);
  	}
})(window, function(window) {

	'use strict';

	
	var storage = window.localStorage;


	function serialize(data) {
		return JSON.stringify(data);
	}

	
	function unserialize(data) {
		return JSON.parse(data);
	}

	
	function asyncExec(callback) {
		setTimeout(callback, 10);
	}


	return {

		clear: function() {
			asyncExec(function() { storage.clear(); });
		},

		// save data with expires.
		// we'll automatically transform data to a string, so you need not do this by yourself.
		// expires is a number of micro second to determine that how long the data will be valid.
		setItem: function(key, data, expires, onerror) {
			var toSave = {v: data};

			if (typeof expires === 'function') {
				onerror = expires; 
				expires = undefined;
			}

			if (expires > 0) {
				toSave.t = Date.now() + expires;
			}
			
			asyncExec(function() {
				try {
					storage.setItem(key, serialize(toSave));
				} catch(e) {
					if (onerror) onerror(e);
				}
			});
		},

		getItem: function(key, callback) {
			asyncExec(function() {
				var data = unserialize(storage.getItem(key));
				var val = data.v;
				var expires = data.t;
				if (typeof expires !== 'undefined' && Date.now() >= expires) {
					val = null; 
					storage.removeItem(key);
				}
				callback(val);
			});
		},

		removeItem: function(key) {
			asyncExec(function() {
				key.split(' ').forEach(function(k) {
					storage.removeItem(k);
				});
			});
		},

		key: function(nth, callback) {
			asyncExec(function() {
				callback(storage.key(nth));
			});
		}
	};
});




