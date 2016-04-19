/**
 * A wrapper of localStorage 
 * in order to support expiration time and asynchronous execution.
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


	// inspired by https://gist.github.com/WebReflection/2953527
	var nextTick = (function() {
		var fnc = window.requestAnimationFrame;
		var prefixes = 'ms o moz webkit'.split(' ');
		var i = prefixes.length;
		while (!fnc && --i > -1) {
			fnc = window[prefixes[i] + 'RequestAnimationFrame'];
		}
		return fnc || window.setImmediate || window.setTimeout;
	})();


	function serialize(data) {
		return JSON.stringify(data);
	}

	
	function unserialize(data) {
		try {
			return JSON.parse(data);
		} catch(e) {}
	}


	return {

		clear: function() {
			nextTick(function() { storage.clear(); });
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
			nextTick(function() {
				try {
					storage.setItem(key, serialize(toSave));
				} catch(e) {
					if (onerror) onerror(e);
				}
			});
		},

		getItem: function(key, callback) {
			nextTick(function() {
				var data, val, expires;
				data = storage.getItem(key);
				if (data && (data = unserialize(data))) {
					val = data.v;
					expires = data.t;
					if (typeof expires !== 'undefined' && Date.now() >= expires) {
						val = null; 
						storage.removeItem(key);
					}	
				}
				callback(typeof val === 'undefined' ? null : val);
			});
		},

		// support mutiple keys
		removeItem: function(key) {
			nextTick(function() {
				key.split(' ').forEach(function(k) {
					storage.removeItem(k);
				});
			});
		},

		key: function(nth) {
			return storage.key(nth);
		},

		getLength: function() {
			return storage.length;
		}
	};
});




