(function (module) {

var idCounter = 0;

function Planner(config, Memory, algorithms, Errors) {
	console.log('initing Planner');
	this.memory = Memory;
	this.algorithms = algorithms;
	this.error = Errors.add.bind(Errors);

	this.error('There is no holes to fit a process with a lenght of X.')

	console.log('available fitters', Object.keys(algorithms), Object.keys(algorithms)[0]);

	if (!Object.keys(algorithms).length) {
		throw new Error('There is no algorithms registered.');
	} else {
		var algo = Object.keys(algorithms)[0];
		this.setFitter(Object.keys(algorithms)[0]);
	}
}

Planner.prototype = {
	algorithms: [],
	fitter: null,
	setFitter: function (name) {
		this.fitter = this.algorithms[name] && name || this.fitter;
	},
	allocate: function (size) {
		var holes = _.filter(this.memory.getHoles(), function (el) {
			return el.size>=size;
		});

		if (!holes.length) {
			return new Error(this.error('There is no holes to fit a process with a lenght of '+size+'.'));
		}

		var start = this.algorithms[this.fitter](size, holes).start;

		console.log('holes', holes, 'went with', start);

		return this.memory.allocate(start, size);
	},
	clear: function () {
		return this.memory.removeAll();
	},
	remove: function () {
		return this.memory.remove.apply(this.memory, arguments);
	}
};

module.service('Planner', Planner);
	
})(angular.module('memorySimulator'));
