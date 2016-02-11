(function()
{
    'use strict';

    angular
        .module('lumx.utils.event-scheduler')
        .service('LxEventSchedulerService', LxEventSchedulerService);

    LxEventSchedulerService.$inject = ['$document', 'LxUtils'];

    function LxEventSchedulerService($document, LxUtils)
    {
        var service = this;
        var handlers = {};
        var schedule = {};

        service.register = register;
        service.unregister = unregister;

        ////////////

        function handle(event)
        {
            var scheduler = schedule[event.type];

            if (angular.isDefined(scheduler))
            {
                for (var i = 0, length = scheduler.length; i < length; i++)
                {
                    var handler = scheduler[i];

                    if (angular.isDefined(handler) && angular.isDefined(handler.callback) && angular.isFunction(handler.callback))
                    {
                        handler.callback(event);

                        if (event.isPropagationStopped())
                        {
                            break;
                        }
                    }
                }
            }
        }

        function register(eventName, callback)
        {
            var handler = {
                eventName: eventName,
                callback: callback
            };

            var id = LxUtils.generateUUID();
            handlers[id] = handler;

            if (angular.isUndefined(schedule[eventName]))
            {
                schedule[eventName] = [];

                $document.on(eventName, handle);
            }
            schedule[eventName].unshift(handlers[id]);

            return id;
        }

        function unregister(id)
        {
            var found = false;
            var handler = handlers[id];

            if (angular.isDefined(handler) && angular.isDefined(schedule[handler.eventName]))
            {
                var index = schedule[handler.eventName].indexOf(handler);

                if (angular.isDefined(index) && index > -1)
                {
                    schedule[handler.eventName].splice(index, 1);

                    delete handlers[id];
                    found = true;
                }

                if (schedule[handler.eventName].length === 0)
                {
                    delete schedule[handler.eventName];

                    $document.off(handler.eventName, handle);
                }
            }

            return found;
        }
    }
})();