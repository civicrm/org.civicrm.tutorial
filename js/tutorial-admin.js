(function($, _, ts) {
  var tour,
    oldIndex,
    currentStep = 0,
    ENTER_KEY = 13,
    TEXT_NODE = 3,
    saved = true,
    templatesLoaded,
    templates = {
      admin_main_tpl: null,
      admin_step_tpl: null
    },
    stepDefaults = {
      target: '',
      title: '',
      placement: 'bottom',
      content: '',
      icon: null
    };

  $('#civicrm-menu').ready(function() {
    var tourMenu = $('.menu-item a[href$="#tutorial-admin"]');
    if (tourMenu.length) {
      if (CRM.vars && CRM.vars.tutorial) {
        tourMenu.contents()
          .filter(function() {
            return this.nodeType === TEXT_NODE;
          })
          .replaceWith(ts("Edit tour of this screen"));
      }
      tourMenu.click(function(e) {
        e.preventDefault();
        editTour();
      });
    }
  });

  function setDefaults() {
    if (!CRM.vars) CRM.vars = {};
    if (!CRM.vars.tutorial) CRM.vars.tutorial = {};
    currentStep = 0;
    CRM.vars.tutorial = _.extend({
      id: defaultId(),
      url: defaultUrl(),
      steps: [],
      groups: []
    }, CRM.vars.tutorial);
    tour = CRM.vars.tutorial;
    delete tour.viewed;
    if (!tour.steps.length) {
      addStep();
    }
  }

  function setSaved(val) {
    saved = val;
    $('#civitutorial-admin-save').prop('disabled', saved);
  }

  function addStep() {
    var step = _.extend({}, stepDefaults);
    tour.steps.push(step);
    setSaved(false);
    return step;
  }

  function createStep() {
    var num = tour.steps.length;
    var step = addStep();
    renderStep(step, num);
    $('#civitutorial-steps').accordion('refresh').accordion('option', 'active', -1).find('h5').off('keydown');
  }

  function deleteStep() {
    var $step = $(this).closest('.civitutorial-step'),
      index = $step.index();
    tour.steps.splice(index, 1);
    $step.remove();
    $('#civitutorial-steps').accordion('refresh').find('h5').off('keydown');
  }

  function defaultId() {
    return _.kebabCase($('h1').first().text().toLowerCase());
  }

  function defaultUrl() {
    var path = window.location.pathname,
      query = window.location.search,
      pos = path.indexOf('/civicrm/');
    if (pos > -1) {
      return path.slice(pos + 1);
    }
    pos = query.indexOf('civicrm/');
    return query.slice(pos).split('&')[0];
  }

  function close() {
    hopscotch.endTour();
    $('#civitutorial-admin, #civitutorial-overlay, #tutorial-admin-css').remove();
    $('body').removeClass('civitutorial-admin-open');
    if (!saved) {
      hopscotch.startTour({
        id: 'admin-unsaved',
        steps: [
          {
            target: $('.menumain a[href$="#tutorial-start"]').closest('.menumain')[0],
            placement: 'bottom',
            nextOnTargetClick: true,
            title: ts('Unsaved Changes.'),
            content: ts('Your tutorial has not been saved. You can get back into editing it from this menu; if you leave or refresh this page your changes will be lost.')
          }
        ],
        i18n: {
          doneBtn: ts('Close'),
          stepNums: ['<i class="crm-i fa-info"></i>']
        }
      });
    }
  }

  function save(e) {
    e.preventDefault();
    setSaved(true);
    CRM.api3('Tutorial', 'create', tour, true);
  }

  function openPreview() {
    hopscotch.endTour();
    if (tour.steps[currentStep]) {
      var step = _.cloneDeep(tour.steps[currentStep]);
      step.title = step.title || ' ';
      step.content = step.content || ' ';
      if (step.target) {
        hopscotch.startTour({
          id: 'preview-tour-step-' + currentStep,
          steps: [step],
          i18n: {stepNums: [step.icon ? '<i class="crm-i ' + step.icon + '"></i>' : currentStep + 1]}
        });
      }
    }
  }

  function selectTarget(e) {
    hopscotch.endTour();
    e.stopImmediatePropagation();
    $('body')
      .addClass('civitutorial-select-target')
      .on('click.tutorialAdmin', onTargetClick);
  }

  function doneSelecting() {
    $('body')
      .removeClass('civitutorial-select-target')
      .off('.tutorialAdmin');
  }

  function onTargetClick(e) {
    doneSelecting();
    if ($(e.target).closest('#civitutorial-admin').length < 1) {
      e.preventDefault();
      pickBestTarget($(document.elementFromPoint(e.clientX, e.clientY)));
    }
  }

  function pickBestTarget($target, child) {
    var id, name, selector,
      targetField = $('.civitutorial-step-content').eq(currentStep).find('[name=target]'),
      select2 = $target.closest('.select2-container'),
      classes = _.trim($target.attr('class') || '');
    child = child || '';
    if (select2.length) {
      pickBestTarget(select2.parent(), ' .select2-container');
    } else if ($target.is('[id] > a')) {
      pickBestTarget($target.parent());
    } else if ($target.attr('id')) {
      targetField.val('#' + $target.attr('id') + child).change();
    } else if (classes && !$target.is('span, strong, i, b, em, p, hr')) {
      id = $target.closest('[id]').attr('id');
      name = $target.attr('name');
      selector = (id ? '#' + id + ' ' : '') + (name ? '[name="' + name + '"]' : ' .' + classes.replace(/[ ]+/g, '.'));
      if ($(selector).index($target) > 0) {
        selector += ':eq(' + $(selector).index($target) + ')';
      }
      targetField.val(selector + child).change();
    } else {
      pickBestTarget($target.parent());
    }
  }

  function updateFieldVal($field, values) {
    var val,
      fieldName = $field.attr('name');
    if ($field.is('#civitutorial-field-id')) {
      $field.val(_.kebabCase($field.val()));
    }
    if ($field.is(':checkbox')) {
      val = $field.is(':checked');
    } else if ($field.is('[contenteditable]')) {
      val = $field.html();
    } else {
      val = $field.val();
    }
    if ($field.is('.crm-form-entityref')) {
      val = val ? val.split(',') : [];
    }
    values[fieldName] = val;
    if (fieldName === 'target' || fieldName === 'placement') {
      openPreview();
    }
    setSaved(false);
  }

  function updateIcon() {
    var val = $('.civitutorial-step').eq(currentStep).find('[name=icon]').val(),
      icon = val ? '<i class="crm-i ' + val + '"></i>' : '';
    $('.civitutorial-step').eq(currentStep).find('.civitutorial-step-icon').html(icon);
    $('.hopscotch-bubble-number').html(icon || currentStep+1);
  }

  function sortStart(e, ui) {
    oldIndex = $(ui.item).index();
  }

  function sortStop(e, ui) {
    var item = tour.steps[oldIndex],
      newIndex = $(ui.item).index();
    if (newIndex !== oldIndex) {
      tour.steps.splice(oldIndex, 1);
      tour.steps.splice(newIndex, 0, item);
    }
    currentStep = $('.civitutorial-step-title.ui-accordion-header-active', '#civitutorial-steps').closest('.civitutorial-step').index();
    updateIcon();
    $('#civitutorial-steps').accordion('refresh').find('h5').off('keydown');
  }

  function renderStep(step, num) {
    $('#civitutorial-steps')
      .append(templates.admin_step_tpl(_.extend({num: num+1}, stepDefaults, step)))
      .find('.crm-icon-picker').not('.iconpicker-widget').crmIconPicker();
  }

  function loadTemplates() {
    if (!templatesLoaded) {
      templatesLoaded = $.Deferred();
      $.each(templates, function(file) {
        $.get(CRM.vars.tutorialAdmin.path + 'html/' + file + '.html')
          .done(function (html) {
            templates[file] = _.template(html);
            if (_.min(templates) !== null) {
              templatesLoaded.resolve();
            }
          });
      });
    }
    return templatesLoaded;
  }

  function editTour() {
    $('body').append('<form id="civitutorial-admin" class="crm-container"></form><div id="civitutorial-overlay"></div>');
    hopscotch.endTour();
    setDefaults();
    loadTemplates().done(function() {
      $('#civitutorial-admin')
        .css('padding-top', '' + ($('#civicrm-menu').height() + 10) + 'px')
        .html(templates.admin_main_tpl(tour))
        .submit(save);
      $('#civitutorial-admin-close').click(close);
      $('#civitutorial-add-step').click(createStep);
      $('#civitutorial-field-groups').crmEntityRef({
        entity: 'Group',
        api: {id_field: 'name', params: {is_hidden: 0, is_active: 1}},
        select: {placeholder: ts('Groups'), multiple: true, allowClear: true, minimumInputLength: 0}
      });
      $('input[id^="civitutorial-field"]').change(function () {
        updateFieldVal($(this), tour);
      });
      _.each(tour.steps, renderStep);
      $('#civitutorial-steps')
        .on('change input', ':input[name], [contenteditable]', function () {
          var name = $(this).attr('name'),
            index = $(this).closest('.civitutorial-step').index();
          if (index === currentStep && (name === 'title' || name === 'content')) {
            $('.hopscotch-bubble-container .hopscotch-' + name).html(name === 'title' ? $(this).html() : $(this).val());
          }
          updateFieldVal($(this), tour.steps[index]);
        })
        .on('change', '[name=icon]', updateIcon)
        .on('keydown', '[contenteditable]', function (e) {
          if (e.which === ENTER_KEY) {
            e.preventDefault();
            $(this).blur();
          }
        })
        .on('click focus', '[name=target]', selectTarget)
        .on('keydown', '[name=target]', doneSelecting)
        .on('click', '.civitutorial-step-remove', deleteStep)
        .on('accordionbeforeactivate', function (e, ui) {
          currentStep = $(ui.newHeader).closest('.civitutorial-step').index();
          openPreview();
        })
        .sortable({
          axis: 'y',
          handle: '.civitutorial-step-title',
          cancel: '.civitutorial-step-remove, [contenteditable]',
          start: sortStart,
          update: sortStop
        })
        .accordion({
          icons: false,
          header: '.civitutorial-step-title'
        }).find('h5').off('keydown');
    });
    // Set body class after stylesheet loads to trigger css animation
    var cssFile = document.createElement('link');
    cssFile.type = 'text/css';
    cssFile.rel = 'stylesheet';
    cssFile.id = 'tutorial-admin-css';
    cssFile.onload = function() {
      $('body').addClass('civitutorial-admin-open');
    };
    cssFile.href = CRM.vars.tutorialAdmin.path + 'css/tutorial-admin.css';
    $('body')[0].appendChild(cssFile);
    openPreview();
  }

})(CRM.$, CRM._, CRM.ts('org.civicrm.tutorial'));
