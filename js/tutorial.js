(function($, _) {
  $(function() {
    var tour = _.extend({
      showPrevButton: true,
      i18n: {}
    }, CRM.vars.tutorial);

    // Place icons in the step number circle if provided
    tour.i18n.stepNums = _.map(tour.steps, function(step, i) {
      return step.icon ? '<i class="crm-i ' + step.icon + '"></i>' : i + 1;
    });

    hopscotch.startTour(tour);
  });
})(CRM.$, CRM._);
