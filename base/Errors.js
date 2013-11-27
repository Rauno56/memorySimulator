(function (module) {

function Errors() {
}

Errors.prototype = {
	list: [],
	remove: function (ind) {
		return this.list.splice(ind, 1);;
	},
	clear: function () {
		_.times(this.list.length, function () {
			this.pop();
		}, this.list);
	},
	add: function (item) {
		this.list.push(item);
		return item;
	}
};

module.service('Errors', Errors);
	
})(angular.module('memorySimulator'));
