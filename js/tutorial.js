(function($, _, ts) {
  $('#civicrm-menu').ready(function() {
    var tourMenu = $('.menu-item a[href$="#tutorial-start"]');
    if (tourMenu.length) {
      if (!CRM.vars || !CRM.vars.tutorial) {
        tourMenu.hide();
      } else {
        tourMenu.click(function(e) {
          e.preventDefault();
          startTour();
        });
        if (!CRM.vars.tutorial.viewed) {
          startTour();
        }
      }
    }
  });

  function startTour() {
    var defaults = {
      showPrevButton: true,
      i18n: {
        doneBtn: ts('Done'),
        prevBtn: ts('Back')
      }
    };
    if (!CRM.vars.tutorial.viewed) {
      defaults.onClose = defaults.onEnd = endTour;
    }
    var tour = _.extend(defaults, CRM.vars.tutorial);

    // Place icons in the step number circle if provided
    tour.i18n.stepNums = _.map(tour.steps, function(step, i) {
      return step.icon ? '<i class="crm-i ' + step.icon + '"></i>' : i + 1;
    });

    hopscotch.startTour(tour);
  }

  function endTour() {
    var supportMenu = $('.menumain a[href$="#tutorial-start"]').closest('.menumain');
    if (supportMenu.length) {
      window.setTimeout(function() {
        hopscotch.startTour({
          id: 'tour-closed',
          steps: [
            {
              target: $(supportMenu)[0],
              placement: 'bottom',
              nextOnTargetClick: true,
              content: ts('To see this tour again, or for more ways to learn and get help, open the Support menu.')
            }
          ],
          i18n: {
            doneBtn: ts('Got it'),
            stepNums: ['<i class="crm-i fa-info"></i>']
          }
        });
      }, 200);
    }
  }

})(CRM.$, CRM._, CRM.ts('org.civicrm.tutorial'));
