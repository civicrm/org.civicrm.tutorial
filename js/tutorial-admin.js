(function($, _, ts) {
  var tour,
    targetField,
    ESC_KEY = 27,
    ENTER_KEY = 13,
    saved = true,
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
            return this.nodeType === 3;
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
    CRM.vars.tutorial = _.extend({
      id: defaultId(),
      url: defaultUrl(),
      steps: [],
      groups: []
    }, CRM.vars.tutorial);
    tour = CRM.vars.tutorial;
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
    var title = $(this).closest('.civitutorial-step-title'),
      index = title.prevAll('.civitutorial-step-title').length;
    tour.steps.splice(index, 1);
    title.next().remove();
    title.remove();
    $('#civitutorial-steps').accordion('refresh').find('h5').off('keydown');
  }

  function defaultId() {
    return _.kebabCase($('h1').first().text());
  }

  function defaultUrl() {
    var path = window.location.pathname,
      pos = path.indexOf('/civicrm/');
    return path.slice(pos + 1);
  }

  function close() {
    $('#civitutorial-admin').remove();
    $('body').removeClass('civitutorial-admin-open');
  }

  function save(e) {
    e.preventDefault();
    setSaved(true);
    CRM.api3('Tutorial', 'create', tour, true);
  }

  function selectTarget(e) {
    targetField = $(e.target);
    e.stopImmediatePropagation();
    $('body')
      .addClass('civitutorial-select-target')
      .on('click.tutorialAdmin', onTargetClick)
      .on('keydown.tutorialAdmin', doneSelecting);
  }

  function doneSelecting() {
    $('body')
      .removeClass('civitutorial-select-target')
      .off('.tutorialAdmin');
  }

  function onTargetClick(e) {
    var $target = $(e.target);
    if ($target.closest('#civitutorial-admin').length < 1) {
      e.preventDefault();
      pickBestTarget($target);
    }
    doneSelecting();
  }

  function pickBestTarget($target) {
    if ($target.attr('id')) {
      targetField.val('#' + $target.attr('id'));
    } else if ($target.attr('class') && !$target.is('span, strong, i, b, em')) {
      targetField.val('.' + $target.attr('class').replace(/ /g, '.'));
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
    setSaved(false);
  }

  function updateIcon() {
    var icon = $(this).val(),
      header = $(this).closest('.civitutorial-step-content').prev().find('.civitutorial-step-icon');
    header.html(icon ? '<i class="crm-i ' + icon + '"></i>' : '');
  }

  function renderStep(step, num) {
    $('#civitutorial-steps').append(stepTemplate()(_.extend({num: num+1}, stepDefaults, step))).trigger('crmLoad');
  }

  function mainTemplate() {
    return _.template(
      '<button id="civitutorial-admin-save" disabled="disabled"><i class="crm-i fa-check"></i></button>' +
      '<button type="button" id="civitutorial-admin-close"><i class="crm-i fa-close"></i></button>' +
      '<h4>' + ts('Edit Tutorial') + '</h4>' +
      '<div id="civitutorial-admin-top">' +
      '  <div>' +
      '    <label>' + ts('Name') + ' <span class="crm-marker">*</span></label>' +
      '    <input id="civitutorial-field-id" name="id" class="crm-form-text twenty" value="<%= id %>" required />' +
      '    <div class="description">' + ts('Spaces and punctuation not allowed.') + '</div>' +
      '  </div>' +
      '  <div>' +
      '    <label>' + ts('Page') + ' <span class="crm-marker">*</span></label>' +
      '    <input id="civitutorial-field-url" name="url" class="crm-form-text twenty" value="<%= url %>" required />' +
      '    <div class="description">' + ts('Relative url of page.') + '</div>' +
      '  </div>' +
      '  <div>' +
      '    <label>' + ts('For') + '</label>' +
      '    <input id="civitutorial-field-groups" name="groups" class="crm-form-text twenty" value="<%= groups ? groups.join(",") : "" %>" />' +
      '    <div class="description">' + ts('Users who will see this tutorial.') + '</div>' +
      '  </div>' +
      '</div>' +
      '<div id="civitutorial-steps"></div>' +
      '<br />' +
      '<button type="button" id="civitutorial-add-step"><i class="crm-i fa-plus"></i> ' + ts('Add Step') + '</button>'
    );
  }

  function stepTemplate() {
    return _.template(
      '<h5 class="civitutorial-step-title">' +
      '  <div class="civitutorial-step-icon"><% if(icon) { %><i class="crm-i <%= icon %>"></i><% } %></div>' +
      '  <div contenteditable="true" class="crm-editable-enabled" name="title"><%= title || ts("Untitled") %></div>' +
      '  <i class="crm-i fa-window-close-o civitutorial-step-remove"></i>' +
      '</h5>' +
      '<div class="civitutorial-step-content">' +
      '  <div>' +
      '    <textarea name="content" class="crm-form-textarea"><%= content %></textarea>' +
      '  </div>' +
      '  <div>' +
      '    <label>' + ts('Element') + ' <span class="crm-marker">*</span></label>' +
      '    <input name="target" class="crm-form-text twenty" value="<%= target %>" required />' +
      '    <div class="description">' + ts('Css selector of page element.') + '</div>' +
      '  </div>' +
      '  <div>' +
      '    <label>' + ts('Placement') + ' <span class="crm-marker">*</span></label>' +
      '    <select name="placement" class="crm-form-select" required >' +
      '      <option value="top" <% if (placement == "top") { %> selected="selected" <% } %>>' + ts('Top') + '</option>' +
      '      <option value="bottom" <% if (placement == "bottom") { %> selected="selected" <% } %>>' + ts('Bottom') + '</option>' +
      '      <option value="left" <% if (placement == "left") { %> selected="selected" <% } %>>' + ts('Left') + '</option>' +
      '      <option value="right" <% if (placement == "right") { %> selected="selected" <% } %>>' + ts('Right') + '</option>' +
      '    </select>' +
      '  </div>' +
      '  <div>' +
      '    <label>' + ts('Icon') + '</label>' +
      '    <input name="icon" class="crm-form-text crm-icon-picker" allowclear="1" value="<%= icon %>" />' +
      '    <a class="crm-hover-button crm-clear-link" <% if(!icon) { %>style="visibility:hidden;"<% } %>><i class="crm-i fa-times"></i></a>' +
      '  </div>' +
      '</div>'
    );
  }

  function editTour() {
    hopscotch.endTour();
    setDefaults();
    $('body').append('<form id="civitutorial-admin" class="crm-container"></form>');
    // Slight delay so css animation works
    window.setTimeout(function () {
      $('body').addClass('civitutorial-admin-open');
    }, 10);
    $('#civitutorial-admin')
      .html(mainTemplate()(tour))
      .submit(save);
    $('#civitutorial-admin-close').click(close);
    $('#civitutorial-add-step').click(createStep);
    $('#civitutorial-field-groups').crmEntityRef({entity: 'Group', api: {id_field: 'name', params: {is_hidden: 0, is_active: 1}}, select: {placeholder: ts('Groups'), multiple: true, allowClear:true, minimumInputLength: 0}});
    $('input[id^="civitutorial-field"]').change(function() {
      updateFieldVal($(this), tour);
    });
    _.each(tour.steps, renderStep);
    $('#civitutorial-steps')
      .on('change input', ':input[name], [contenteditable]', function() {
        var parentClass = $(this).attr('name') == 'title' ? '.civitutorial-step-title' : '.civitutorial-step-content',
          index = $(this).prevAll(parentClass).length;
        updateFieldVal($(this), tour.steps[index]);
      })
      .on('change', '[name=icon]', updateIcon)
      .on('keydown', '[contenteditable]', function(e) {
        if (e.which === ENTER_KEY) {
          e.preventDefault();
          $(this).blur();
        }
      })
      .on('click', '[name=target]', selectTarget)
      .on('click', '.civitutorial-step-remove', deleteStep)
      .accordion({icons: false}).find('h5').off('keydown');
  }

})(CRM.$, CRM._, CRM.ts('org.civicrm.tutorial'));
