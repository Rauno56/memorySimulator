
angular.module('memorySimulator', ['ngAnimate']).value('config', {
  memory: {
    size: 30
  },
  speed: 1500,
  blocksize: 30
}).value('algorithms', {
  first: function (size, fittedHoles) {
    return fittedHoles[0];
  },
  best: function (size, fittedHoles) {
    return _.min(fittedHoles, function (hole) { return hole.size-size; });
  },
  worst: function (size, fittedHoles) {
    return _.max(fittedHoles, function (hole) { return hole.size-size; });
  },
  random: function (size, fittedHoles) {
    return _.sample(fittedHoles);
  }
});

angular.module('memorySimulator').controller('MainCntl', function (Memory, config, Planner, algorithms, Errors) {
  this.config = config;
  this.fitters = _.keys(algorithms);
  console.log('memory in main', this.fitters);
  this.blocksize = config.blocksize;
  this.memory = Memory;
  this.todo = [];
  this.errors = Errors.list;
  this.processes = Memory.processes;
  this.exampleInputs = [[
      '2,10',
      '4,3',
      '5,8',
      '3,2',
      '10,5',
      '3,5',
      '4,3',
      '3,2'
    ].join(';'), [
      '15,2',
      '12,6',
      '3,8',
      '4,8',
      '4,8',
      '7,8',
    ].join(';'), [
      '16,2',
      '10,3',
      '14,2',
      '2,7',
      '15,1',
      '26,1',
      '26,1'
    ].join(';')

  ];

  Memory.allocate(0, 3);
  Memory.allocate(4, 2);
  Memory.allocate(6, 1);
  Memory.allocate(19, 1);


  this.remove = function (item) {
    Memory.remove(item.id);
  };

  this.allocate = function (add) {
    var res;
    add = _.map((add || '').split(','), function (el) {
      return parseInt(el, 10);
    });
    if (add.length == 2) {
      res = Memory.allocate(add[0], add[1]);
      if (res === true) {
        console.log('success');
        this.addInput = '';
      } else {
        console.log(res, res.message);
      }
    } else {
      console.log('This should be commaseparated list of two things - start and size.');
    }
  };

  this.getHoles = function () {
    var holes = Memory.getHoles();
    console.log('holes');
    console.log(holes);
  };
});

angular.module('memorySimulator').controller('PlayCntl', function (Planner, config, $timeout, Errors) {
  this.playInput = '10,5;20,7;1,3;2,2;12,3';
  this.fitterInput = Planner.fitter;
  this.onPause = false;
  var SIZE = 0;
  var LIFE_TIME = 1;
  var todo = this.todo;
  var timeout = null;
  var sequence;
  var stepTimeout;

  this.play = function (inputSeqence) {
    this.abort();
    Planner.clear();
    Errors.clear();


    sequence = inputSeqence.split(';').map(function (el) {
      el = el.split(',').map(function (el) {
        return parseInt(el, 10);
      });
      return [{life: el[LIFE_TIME], size: el[SIZE]}];
    });

    var addRemoveTask = function (time, id) {
      if (Array.isArray(sequence[time])) {
        sequence[time].push({
          remove: id
        });
      } else {
        sequence[time] = [{
          remove: id
        }];
      }
    };

    var next = function () {
      var tasks = sequence.shift();
      console.log('cycle', tasks, sequence);

      if (tasks) {
        _.forEach(tasks.reverse(), function (task) {
          var id;
          if (task.life) {
            id = Planner.allocate(task.size);
            if (_.isNumber(id)) {
              addRemoveTask(task.life-1, id);
            } else {
              console.error(id, id.message);
            }
          } else if (task.remove) {
            Planner.remove(task.remove);
          }
        });
      }

      if (sequence.length) {
        stepTimeout = $timeout(next, config.speed);
      }
    };

    next();
  };

  this.abort = function () {
    console.log(stepTimeout);
    $timeout.cancel(stepTimeout);
  };

  this.setFitter = function (fitter) {
    console.log('set fitter', fitter);
    Planner.setFitter(fitter);
  };

});

angular.module('memorySimulator').controller('ErrorCntl', function (Errors) {
  this.list = Errors.list;
  this.remove = Errors.remove.bind(Errors);

});
