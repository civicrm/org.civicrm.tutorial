(function($, _) {
  $.getJSON(CRM.vars.tutorial.url)
    .done(function(content) {
      var tour = {
        id: CRM.vars.tutorial.name,
        showPrevButton: true,
        i18n: {
          // Place icons in the step number circle if provided
          stepNums: _.map(content, function(step, i) {
            return step.icon ? '<i class="crm-i ' + step.icon + '"></i>' : i + 1;
          })
        },
        steps: content
      };

      hopscotch.startTour(tour);
    });
})(CRM.$, CRM._);
