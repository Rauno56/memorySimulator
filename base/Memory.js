(function (module) {

var idCounter = 0;

function Memory(config, Errors) {
	console.log('initing memory');
	this.size = config.memory.size;
	this.error = Errors.add.bind(Errors);
}

Memory.prototype = {
	size: 10,
	processes: [],
	allocate: function (start, size) {
		console.log('allocate', start, size);
		if (this.isAvailable(start, size)) {
			var ps = {
				id: idCounter++,
				start: start,
				size: size
			};
			this.processes.push(ps);
			return ps.id;
			console.log(' ---> ', ps);
		} else {
			return new Error(this.error('Position not available in that range. Tried '+start+','+size+'.'));
		}
	},
	isAvailable: function (start, size) {
		var end = start+size;
		console.log('consulting avability', this.processes, start, size, end, this.size);
		if (end > this.size) return false;
		return _(this.processes).all(function (el) {
			var elEnd = el.start + el.size;
			console.log('comp',el);
			return (end <= el.start && start <= el.start) || (elEnd <= start && elEnd <= end);
		});
	},
	remove: function (id) {
		console.log('removing', id);
		return _.remove(this.processes, function(el) { return el.id == id; })[0];
	},
	removeAll: function () {
		console.log('removing all', this.processes,this.processes.length);
		_.times(this.processes.length, function () {
			this.pop();
		}, this.processes);
	},
	getHoles: function () {
		var map = new Array(this.size);
		var holes = [];
		var last;
		_.forEach(this.processes, function (ps) {
			map[ps.start] = ps.size;
		});
		console.log(map.join('.'));
		for (var i=0; i<this.size; i++) {
			if (map[i]) {
				// console.log('filled', i);
				if (last && !last.size) {
					last.size = i-last.start;
				}
				i+=map[i]-1;
			} else {
				if (!last || last.size) {
					// console.log('new empty', i);
					last = {
						start: i
					};
					holes.push(last);
				}
				// console.log('empty', i);
			}
		}
		// console.log('map', map);
		if (last && !last.size) {
			last.size = i-last.start;
		}
		return holes;
	}
};

module.service('Memory', Memory);
	
})(angular.module('memorySimulator'));
