define(['ko'], function(ko){
    let calculateAnimationTime = function(element, props){
        let duration, delay;

        if (props.action === 'add'){
            //clone element to look ahead:
            var clone = element.cloneNode(true);
            clone.classList.add(props.class);
            clone.style.display = 'none';
            element.parentElement.appendChild(clone);

            duration = window.getComputedStyle(clone)["transition-duration"];
            delay = window.getComputedStyle(clone)["transition-delay"];
            
            element.parentElement.removeChild(clone);
        } else {
            duration = window.getComputedStyle(element)["transition-duration"];
            delay = window.getComputedStyle(element)["transition-delay"];
        }

        duration = duration.indexOf(', ') != -1 ? duration.split(', ').map(n => parseFloat(n)) : duration;
        delay = delay.indexOf(', ') != -1 ? delay.split(', ').map(n => parseFloat(n)) : delay;
        duration = Array.isArray(duration) ? duration.reduce((n, m) => Math.max(n, m)) : parseFloat(duration);
        delay = Array.isArray(delay) ? delay.reduce((n, m) => Math.max(n, m)) : parseFloat(delay);
        duration *= 1000;
        delay *= 1000;

        return delay + duration;
    };
    return {
        init: function(element, valueAccessor) {
            let steps = ko.unwrap(valueAccessor());
            steps.forEach((step) => {
                if (!step.hasOwnProperty('ready')) step.ready = ko.observable(false);
                let cList = Array.from(element.classList);

                if ((!cList.includes(step.class) && step.action === 'add') ||
                (cList.includes(step.class) && step.action === 'remove')) {
                    step.timeout = step.hasOwnProperty('timeout') ? step.timeout : calculateAnimationTime(element, step);
                    step.timeout += step.hasOwnProperty('offset') ? step.offset : 0;
                    step.element = element;
                } else {
                    step.timeout = 0;
                }
                step.ready(true);
            });
        }
    }
});