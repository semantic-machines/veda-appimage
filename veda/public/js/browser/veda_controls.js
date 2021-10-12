"use strict";

System.register(["../common/veda.js", "jquery", "autosize", "../common/util.js", "adoptedStyleSheets"], function (_export, _context) {
  "use strict";

  var veda, $, autosize, Util;

  function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  // INPUT CONTROLS
  // Generic literal input behaviour

  /**
   * Basic literal input.
   * @param {Object} options
   * @this jQuery
   * @return {jQuery}
   */
  function veda_literal_input(options) {
    var opts = $.extend({}, veda_literal_input.defaults, options);
    var input = $(opts.template);
    var spec = opts.spec;
    var placeholder = this.attr('placeholder') || (spec && spec.hasValue('v-ui:placeholder') ? spec['v-ui:placeholder'].map(Util.formatValue).join(' ') : '');
    var property_uri = opts.property_uri;
    var individual = opts.individual;
    var timeout;
    input.isSingle = typeof opts.isSingle !== 'undefined' ? opts.isSingle : spec && spec.hasValue('v-ui:maxCardinality') ? spec['v-ui:maxCardinality'][0] === 1 : true;
    input.attr({
      'placeholder': placeholder,
      'name': (individual.hasValue('rdf:type') ? individual['rdf:type'].pop().id + '_' + property_uri : property_uri).toLowerCase().replace(/[-:]/g, '_')
    }).on('change focusout', changeHandler).keyup(function (e) {
      if (!input.isSingle) {
        return;
      }

      if (e.which === 13) {
        input.change();
      }

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(keyupHandler, 50, e);
    });
    individual.on(property_uri, propertyModifiedHandler);
    input.one('remove', function () {
      individual.off(property_uri, propertyModifiedHandler);
    });
    propertyModifiedHandler();
    /**
     * Individual property handler.
     * @return {void}
     */

    function propertyModifiedHandler() {
      if (input.isSingle) {
        var field = input[0];
        var value = veda.Util.formatValue(individual.get(property_uri)[0]);
        value = typeof value !== 'undefined' ? value : '';

        if (field.value != value) {
          try {
            var start_shift = field.selectionStart - field.value.length;
            var end_shift = field.selectionEnd - field.value.length;
            field.value = value;
            field.selectionStart = value.length + start_shift;
            field.selectionEnd = value.length + end_shift;
          } catch (ex) {
            field.value = value;
            console.log('selectionStart/End error:', property_uri, value, _typeof(value));
          }
        }
      }
    }
    /**
     * Input change handler
     * @param {Event} e
     * @this jQuery
     * @return {void}
     */


    function changeHandler(e) {
      var value = opts.parser(this.value);

      if (input.isSingle) {
        individual.set(property_uri, [value]);
      } else {
        individual.set(property_uri, individual.get(property_uri).concat(value));
        this.value = '';
      }
    }
    /**
     * Input keyup handler
     * @param {Event} e
     * @this jQuery
     * @return {void}
     */


    function keyupHandler(e) {
      var input = $(e.target);

      if (e.which !== 188 && e.which !== 190 && e.which !== 110 && input.val() !== input.data('prev')) {
        input.data('prev', input.val());
        input.change();
      }

      if (e.which !== 9) {
        input.focus();
      }
    }

    this.on('view edit search', function (e) {
      e.stopPropagation();
    });

    this.val = function (value) {
      if (!value) return input.val();
      return input.val(veda.Util.formatValue(value));
    };

    if (spec && spec.hasValue('v-ui:tooltip')) {
      input.tooltip({
        title: spec['v-ui:tooltip'].join(', '),
        placement: 'bottom',
        container: 'body',
        trigger: 'manual',
        animation: false
      }).one('remove', function () {
        input.tooltip('destroy');
      }).on('focusin', function () {
        input.tooltip('show');
      }).on('focusout change', function () {
        input.tooltip('hide');
      });
    }

    return input;
  }

  // MULTILINGUAL INPUT CONTROLS

  /**
   * Generic multilingual input behaviour
   * @param {Object} options
   * @return {jQuery}
   * @this jQuery
   */
  function veda_multilingual(options) {
    var opts = $.extend({}, veda_multilingual.defaults, options);
    var self = this;
    var individual = opts.individual;
    var property_uri = opts.property_uri;
    var spec = opts.spec;
    var placeholder = this.attr('placeholder') || (spec && spec.hasValue('v-ui:placeholder') ? spec['v-ui:placeholder'].map(Util.formatValue).join(' ') : '');
    var timeout;
    var tabindex = this.attr('tabindex');

    if (tabindex) {
      this.removeAttr('tabindex');
      this.find('input').attr('tabindex', tabindex);
    }

    Object.keys(veda.user.preferences.language).map(function (language_name) {
      var localedInput = $(opts.template);
      localedInput.find('.language-tag').text(language_name);
      var formControl = localedInput.find('.form-control');
      formControl.attr({
        'lang': language_name,
        'placeholder': placeholder,
        'name': (individual.hasValue('rdf:type') ? individual['rdf:type'].pop().id + '_' + property_uri : property_uri).toLowerCase().replace(/[-:]/g, '_')
      }).on('change focusout', function () {
        var values = self.find('.form-control').map(function (i, el) {
          return opts.parser(el.value, el);
        }).get();
        individual.set(property_uri, values);
      }).keyup(function (e) {
        if (e.which === 13) {
          formControl.change();
        }

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(keyupHandler, 50, e);
      });
      individual.get(property_uri).forEach(function (value) {
        if (value.language === language_name || !value.language) {
          formControl.val(value);
        }
      });
      self.append(localedInput);
    });
    var input = self.find('.form-control');
    individual.on(property_uri, handler);
    self.one('remove', function () {
      individual.off(property_uri, handler);
    });
    /**
     * Input keyup handler
     * @param {Event} e
     * @return {void}
     */

    function keyupHandler(e) {
      var input = $(e.target);

      if (e.which !== 188 && e.which !== 190 && e.which !== 110 && input.val() !== input.data('prev')) {
        input.data('prev', input.val());
        input.change();
      }

      if (e.which !== 9) {
        input.focus();
      }
    }
    /**
     * Individual property change handler
     * @param {Array} values
     * @return {void}
     */


    function handler(values) {
      input.each(function (i, el) {
        var self = el;
        var lang = el.lang;
        individual.get(property_uri).forEach(function (value) {
          if (value.language === lang || !value.language && self.value != value) {
            try {
              if (self === document.activeElement) {
                var start_shift = self.selectionStart - self.value.length;
                var end_shift = self.selectionEnd - self.value.length;
                self.value = value;
                self.selectionStart = value.length + start_shift;
                self.selectionEnd = value.length + end_shift;
              } else {
                self.value = value;
              }
            } catch (ex) {
              self.value = value;
              console.log('selectionStart/End error:', property_uri, value, _typeof(value));
            }
          }
        });
      });
    }

    self.on('view edit search', function (e) {
      e.stopPropagation();
    });

    self.val = function (value) {
      if (!value) {
        return parser(input.val());
      }

      input.each(function (i, el) {
        if (value.language === el.lang || !value.language) {
          el.value = value.toString();
        }
      });
    };

    if (spec && spec.hasValue('v-ui:tooltip')) {
      self.tooltip({
        title: spec['v-ui:tooltip'].join(', '),
        placement: 'bottom',
        container: 'body',
        trigger: 'manual',
        animation: false
      }).one('remove', function () {
        self.tooltip('destroy');
      });
      input.on('focusin', function () {
        self.tooltip('show');
      }).on('focusout change', function () {
        self.tooltip('hide');
      });
    }

    return self;
  }

  // FILE UPLOAD CONTROL

  /**
   * Load image to browser
   * @param {File} imageFile - value from file input
   * @return {Promise}
   */
  function loadImage(imageFile) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var image = new Image();

        image.onload = function () {
          resolve(image);
        };

        image.onerror = function () {
          reject(new Error('Image load error'));
        };

        image.src = e.target.result;
      };

      reader.onerror = function () {
        reject(new Error('File reader error'));
      };

      reader.readAsDataURL(imageFile);
    });
  }
  /**
   * Resize image to max width
   * @param {Image} image
   * @param {number} maxWidth - width in pixels
   * @return {Promise}
   */


  function resizeImage(image, maxWidth) {
    return new Promise(function (resolve, reject) {
      if (image.width <= maxWidth) {
        resolve(image);
      } else {
        var temp = $('<div></div>').append(image);
        System.import('cropper/cropper.min.js').then(function (module) {
          var Cropper = module.default;
          System.import('cropper/cropper.min.css').then(function (module) {
            var styleSheet = module.default;
            document.adoptedStyleSheets = [].concat(_toConsumableArray(document.adoptedStyleSheets), [styleSheet]);
            var cropper = new Cropper(image, {
              autoCrop: false,
              ready: function ready(event) {
                console.log('Crop ready');
                var ratio = image.height / image.width;
                var resized = new Image();
                resized.src = cropper.getCroppedCanvas({
                  maxWidth: maxWidth,
                  maxHeight: Math.floor(maxWidth * ratio)
                }).toDataURL('image/jpeg');
                resolve(resized);
                cropper.destroy();
              }
            });
          });
        });
      }
    });
  }
  /**
   * Crop image
   * @param {Image} imageForCrop
   * @param {number} ratio
   * @param {number} maxWidth
   * @return {Promise}
   */


  function cropImage(imageForCrop, ratio, maxWidth) {
    var modal = $($('#confirm-modal-template').html());
    modal.modal();
    $('body').append(modal);
    var container = $('.modal-body', modal);
    imageForCrop.style.cssText = 'display:block; width:100%';
    var temp = $('<div></div>').append(imageForCrop);
    container.append(temp);
    return new Promise(function (resolve, reject) {
      System.import('cropper/cropper.min.js').then(function (module) {
        var Cropper = module.default;
        System.import('cropper/cropper.min.css').then(function (module) {
          var styleSheet = module.default;
          document.adoptedStyleSheets = [].concat(_toConsumableArray(document.adoptedStyleSheets), [styleSheet]); // in templates ratio=h/w, in crop ratio=w/h

          var cropper = new Cropper(imageForCrop, {
            aspectRatio: 1 / ratio,
            movable: false,
            rotable: false,
            scalable: false,
            ready: function ready(event) {
              console.log('Crop ready');
            }
          });
          $('.modal-footer > .ok', modal).click(function () {
            var img = new Image();
            img.src = cropper.getCroppedCanvas({
              maxWidth: maxWidth,
              maxHeight: Math.floor(maxWidth * ratio)
            }).toDataURL('image/jpeg');
            resolve(img);
            cropper.destroy();
          });
          $('.modal-footer > .cancel', modal).click(function () {
            resolve(false);
          });
          modal.on('hidden.bs.modal', function () {
            modal.remove();
            resolve(false);
            cropper.destroy();
          });
        });
      });
    });
  }

  /* UTILS */

  /**
   * Perform full text search query
   * @param {string} prefix
   * @param {string} input
   * @param {string} sort
   * @param {Boolean} withDeleted
   * @return {Promise}
   */
  function ftQuery(prefix, input, sort, withDeleted) {
    input = input ? input.trim() : '';
    var queryString = '';

    if (input) {
      var lines = input.split('\n').filter(Boolean);
      var lineQueries = lines.map(function (line) {
        var special = line && line.indexOf('==') > 0 ? line : false;

        if (special) {
          return special;
        }

        var words = line.trim().replace(/[-*\s]+/g, ' ').split(' ');
        return words.filter(Boolean).map(function (word) {
          return '\'*\' == \'' + word + '*\'';
        }).join(' && ');
      });
      queryString = lineQueries.filter(Boolean).join(' || ');
    }

    if (prefix) {
      queryString = queryString ? '(' + prefix + ') && (' + queryString + ')' : '(' + prefix + ')';
    }

    var result = [];
    return incrementalSearch(0, 100, []).then(function (results) {
      if (withDeleted) {
        queryString = queryString + ' && (\'v-s:deleted\' == true )';
        return incrementalSearch(0, 100, results);
      } else {
        return results;
      }
    }).then(function (results) {
      results = veda.Util.unique(results);
      var getList = results.filter(function (uri, i) {
        var cached = veda.cache.get(uri);

        if (cached) {
          result[i] = cached.load();
          return false;
        } else {
          return true;
        }
      });

      if (getList.length) {
        return veda.Backend.get_individuals({
          ticket: veda.ticket,
          uris: getList
        });
      } else {
        return [];
      }
    }).then(function (individuals) {
      for (var i = 0, j = 0, length = individuals.length; i < length; i++) {
        while (result[j++]) {
          ;
        } // Fast forward to empty element


        result[j - 1] = new veda.IndividualModel(individuals[i]).init();
      }

      return Promise.all(result);
    }).then(function (fulfilled) {
      return fulfilled.filter(Boolean);
    });
    /**
     * Perform full text search query incrementally
     * @param {string} cursor
     * @param {string} limit
     * @param {Array} results
     * @return {Promise}
     */

    function incrementalSearch(cursor, limit, results) {
      return veda.Backend.query({
        ticket: veda.ticket,
        query: queryString,
        sort: sort ? sort : '\'rdfs:label' + (veda.user.getLanguage()[0] ? '_' + veda.user.getLanguage()[0].toLowerCase() : '') + '\' asc',
        from: cursor,
        top: 10,
        limit: 1000
      }).then(function (queryResult) {
        results = results.concat(queryResult.result);
        var cursor = queryResult.cursor;
        var estimated = queryResult.estimated;

        if (results.length >= limit || cursor >= estimated) {
          return results;
        } else {
          return incrementalSearch(cursor, limit, results);
        }
      });
    }
  }
  /**
   * Render option value
   * @param {IndividualModel|string|number|Boolean|Date} value
   * @param {string} template
   * @return {Promise<string>}
   */


  function renderValue(value, template) {
    if (_instanceof(value, veda.IndividualModel)) {
      return value.load().then(function (value) {
        if (template) {
          return interpolate(template, value);
        } else {
          return value.toString();
        }
      });
    } else {
      return Promise.resolve(veda.Util.formatValue(value));
    }
  }
  /**
   * Interpolate string for rendering
   * @param {string} template
   * @param {IndividualModel} individual
   * @return {Promise}
   */


  function interpolate(template, individual) {
    var promises = [];
    var re_interpolate = /{\s*(.*?)\s*}/g;
    var re_evaluate = /{{\s*(.*?)\s*}}/g;
    template.replace(re_evaluate, function (match, group) {
      var rendered = eval(group);
      promises.push(rendered);
      return '';
    }).replace(re_interpolate, function (match, group) {
      var _target;

      var properties = group.split('.');
      var target = properties.shift();

      if (target === '@') {
        target = individual;
      } else {
        target = new veda.IndividualModel(target);
      }

      var rendered = (_target = target).getChainValue.apply(_target, _toConsumableArray(properties)).then(function (values) {
        return values.map(Util.formatValue).filter(Boolean).join(' ');
      });

      promises.push(rendered);
      return '';
    });
    return Promise.all(promises).then(function (fulfilled) {
      return template.replace(re_evaluate, function () {
        return fulfilled.shift();
      }).replace(re_interpolate, function () {
        return fulfilled.shift();
      });
    });
  }

  return {
    setters: [function (_commonVedaJs) {
      veda = _commonVedaJs.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_autosize) {
      autosize = _autosize.default;
    }, function (_commonUtilJs) {
      Util = _commonUtilJs.default;
    }, function (_adoptedStyleSheets) {}],
    execute: function () {
      ;
      veda_literal_input.defaults = {
        template: $('#string-control-template').html(),
        parser: function parser(input) {
          return input || null;
        }
      }; // Generic input

      $.fn.veda_generic = function (options) {
        var opts = $.extend({}, $.fn.veda_generic.defaults, options);
        var control = veda_literal_input.call(this, opts);
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.attr('tabindex', tabindex);
        }

        this.append(control);
        return this;
      };

      $.fn.veda_generic.defaults = {
        template: $('#string-control-template').html(),
        parser: function parser(input) {
          if (!input || !input.trim()) {
            return null;
          } else if (Date.parse(input) && /^\d{4}-\d{2}-\d{2}.*$/.test(input)) {
            return new Date(input);
          } else if (!isNaN(input.split(' ').join('').split(',').join('.'))) {
            return parseFloat(input.split(' ').join('').split(',').join('.'));
          } else if (input === 'true') {
            return true;
          } else if (input === 'false') {
            return false;
          } else {
            var individ = new veda.IndividualModel(input);

            if (individ.isSync() && !individ.isNew()) {
              return individ;
            }
          }

          return input;
        }
      }; // String input

      $.fn.veda_string = function (options) {
        var opts = $.extend({}, $.fn.veda_string.defaults, options);
        var control = veda_literal_input.call(this, opts);
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.attr('tabindex', tabindex);
        }

        this.append(control);
        return this;
      };

      $.fn.veda_string.defaults = {
        template: $('#string-control-template').html(),
        parser: function parser(input) {
          return input ? String(input) : null;
        },
        isSingle: true
      }; // Uri input

      $.fn.veda_uri = function (options) {
        var opts = $.extend({}, $.fn.veda_uri.defaults, options);
        var control = $(opts.template);
        var individual = opts.individual;
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.attr('tabindex', tabindex);
        }

        ;
        this.on('view edit search', function (e) {
          e.stopPropagation();
        });
        control.attr({
          'placeholder': individual.id
        }).on('change focusout', changeHandler);
        /**
         * Input change handler
         * @return {void}
         */

        function changeHandler() {
          if (control.val()) {
            individual.id = control.val();
          }

          ;
        }

        individual.on('idChanged', function () {
          control.attr('placeholder', individual.id);
        });
        this.append(control);
        return this;
      };

      $.fn.veda_uri.defaults = {
        template: $('#string-control-template').html()
      }; // Text input

      $.fn.veda_text = function (options) {
        var opts = $.extend({}, $.fn.veda_text.defaults, options);
        var control = veda_literal_input.call(this, opts);
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.attr('tabindex', tabindex);
        }

        control.attr('rows', this.attr('rows'));
        autosize(control);
        this.on('edit', function () {
          autosize.update(control);
        });
        this.one('remove', function () {
          autosize.destroy(control);
        });
        this.append(control);
        return this;
      };

      $.fn.veda_text.defaults = {
        template: $('#text-control-template').html(),
        parser: function parser(input) {
          return input ? String(input) : null;
        },
        isSingle: true
      }; // Integer control

      $.fn.veda_integer = function (options) {
        var opts = $.extend({}, $.fn.veda_integer.defaults, options);
        var control = veda_literal_input.call(this, opts);
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.attr('tabindex', tabindex);
        }

        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'search') {
            control.isSingle = false;
          }
        });
        this.append(control);
        return this;
      };

      $.fn.veda_integer.defaults = {
        template: $('#integer-control-template').html(),
        parser: function parser(input) {
          var int = parseInt(input.split(' ').join('').split(',').join('.'), 10);
          return !isNaN(int) ? int : null;
        }
      }; // WorkTime control

      $.fn.veda_worktime = function (options) {
        var opts = $.extend({}, $.fn.veda_worktime.defaults, options);
        var mainInput = veda_literal_input.call(this, opts);
        this.append(mainInput.hide());
        this.append($('#worktime-control-template').html());
        var pseudoInputs = $('div.input-group>input', this);
        var summaryText = $('#worktime-summary-text', this);

        var fillMainInput = function fillMainInput() {
          var count = pseudoInputs[0].value * 480 + pseudoInputs[1].value * 60 + pseudoInputs[2].value * 1;
          mainInput.val(count);
          summaryText.text(veda.Util.formatValue(count));
          mainInput.change();
        };

        var fillPseudoInput = function fillPseudoInput(summaryTime) {
          if (summaryTime) {
            summaryText.text(summaryTime);
            summaryTime = parseInt(summaryTime.split(' ').join('').split(',').join('.'), 10);
            var days = 0;
            var hours = 0;
            var minutes = 0;

            if (summaryTime != 0) {
              days = Math.floor(summaryTime / 480);
              summaryTime = summaryTime - days * 480;

              if (summaryTime != 0) {
                hours = Math.floor(summaryTime / 60);
                summaryTime = summaryTime - hours * 60;

                if (summaryTime != 0) {
                  minutes = summaryTime;
                }
              }
            }

            pseudoInputs[0].value = days;
            pseudoInputs[1].value = hours;
            pseudoInputs[2].value = minutes;
          }
        };

        fillPseudoInput(mainInput.val());
        pseudoInputs.change(fillMainInput);
        this.on('view edit search', function (e) {
          e.stopPropagation();
        });
        return this;
      };

      $.fn.veda_worktime.defaults = {
        parser: function parser(input) {
          var int = parseInt(input.split(' ').join('').split(',').join('.'), 10);
          return !isNaN(int) ? int : null;
        }
      }; // Decimal control

      $.fn.veda_decimal = function (options) {
        var opts = $.extend({}, $.fn.veda_decimal.defaults, options);
        var control = veda_literal_input.call(this, opts);
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.attr('tabindex', tabindex);
        }

        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'search') {
            control.isSingle = false;
          }
        });
        this.append(control);
        return this;
      };

      $.fn.veda_decimal.defaults = {
        template: $('#decimal-control-template').html(),
        parser: function parser(input) {
          var float = parseFloat(input.split(' ').join('').split(',').join('.'));
          return !isNaN(float) ? float : null;
        }
      };
      System.import('moment').then(function (module) {
        var moment = module.default;
        System.import('datetimepicker/js/bootstrap-datetimepicker.min.js').then(function () {
          System.import('datetimepicker/css/bootstrap-datetimepicker.min.css').then(function (module) {
            var styleSheet = module.default;
            document.adoptedStyleSheets = [].concat(_toConsumableArray(document.adoptedStyleSheets), [styleSheet]);
          });
          /**
           * Common dateTime behaviour
           * @param {Object} options
           * @return {jQuery}
           * @this jQuery
           */

          function veda_dateTime(options) {
            var opts = $.extend({}, veda_dateTime.defaults, options);
            var control = $(opts.template);
            var format = opts.format;
            var spec = opts.spec;
            var placeholder = this.attr('placeholder') || (spec && spec.hasValue('v-ui:placeholder') ? spec['v-ui:placeholder'].map(Util.formatValue).join(' ') : '');
            var property_uri = opts.property_uri;
            var individual = opts.individual;
            var isSingle = spec && spec.hasValue('v-ui:maxCardinality') ? spec['v-ui:maxCardinality'][0] === 1 : true;
            var input = $('input', control);
            var change;
            input.attr({
              'placeholder': placeholder,
              'name': (individual.hasValue('rdf:type') ? individual['rdf:type'].pop().id + '_' + property_uri : property_uri).toLowerCase().replace(/[-:]/g, '_')
            });

            var singleValueHandler = function singleValueHandler(values) {
              if (values.length) {
                input.val(moment(values[0]).format(format));
              } else {
                input.val('');
              }
            };

            if (isSingle) {
              change = function change(value) {
                individual.set(property_uri, [value]);
              };

              if (individual.hasValue(property_uri)) {
                input.val(moment(individual.get(property_uri)[0]).format(format));
              }

              individual.on(property_uri, singleValueHandler);
              control.one('remove', function () {
                individual.off(property_uri, singleValueHandler);
              });
            } else {
              change = function change(value) {
                individual.set(property_uri, individual.get(property_uri).concat(value));
                input.val('');
              };
            }

            if (spec && spec.hasValue('v-ui:tooltip')) {
              control.tooltip({
                title: spec['v-ui:tooltip'].join(', '),
                placement: 'auto left',
                container: 'body',
                trigger: 'manual',
                animation: false
              });
              control.one('remove', function () {
                control.tooltip('destroy');
              });
              input.on('focusin', function () {
                control.tooltip('show');
              }).on('focusout change', function () {
                control.tooltip('hide');
              });
            }

            control.datetimepicker({
              locale: Object.keys(veda.user.preferences.language).length === 1 ? Object.keys(veda.user.preferences.language)[0] : 'EN',
              allowInputToggle: true,
              format: format,
              sideBySide: true,
              useCurrent: true,
              widgetPositioning: {
                horizontal: 'auto',
                vertical: 'bottom'
              }
            });
            input.on('change focusout', function (e) {
              var value = opts.parser(e.target.value);
              change(value);
            });
            this.on('view edit search', function (e) {
              e.stopPropagation();

              if (e.type === 'search') {
                change = function change(value) {
                  individual.set(property_uri, individual.get(property_uri).concat(value));
                  input.val('');
                };
              }
            });

            this.val = function (value) {
              if (!value) return input.val();
              return input.val(value);
            };

            this.one('remove', function () {
              control.data('DateTimePicker').destroy();
            });
            return control;
          }

          ;
          veda_dateTime.defaults = {
            template: $('#datetime-control-template').html(),
            parser: function parser(input) {
              if (input) {
                var timestamp = moment(input, 'DD.MM.YYYY HH:mm').toDate();
                return new Date(timestamp);
              }

              return null;
            },
            format: 'DD.MM.YYYY HH:mm'
          }; // Date control

          $.fn.veda_date = function (options) {
            var opts = $.extend({}, $.fn.veda_date.defaults, options);
            var control = veda_dateTime.call(this, opts);
            var tabindex = this.attr('tabindex');

            if (tabindex) {
              this.removeAttr('tabindex');
              control.find('input').attr('tabindex', tabindex);
            }

            this.append(control);
            return this;
          };

          $.fn.veda_date.defaults = {
            template: $('#datetime-control-template').html(),
            parser: function parser(input) {
              if (input) {
                var timestamp = moment(input, 'DD.MM.YYYY').toDate();
                var symbolicDate = new Date(timestamp);
                var d = symbolicDate.getDate();
                var m = symbolicDate.getMonth();
                var y = symbolicDate.getFullYear();
                symbolicDate.setUTCFullYear(y, m, d);
                symbolicDate.setUTCHours(0, 0, 0, 0);
                return symbolicDate;
              }

              return null;
            },
            format: 'DD.MM.YYYY'
          }; // Time control

          $.fn.veda_time = function (options) {
            var opts = $.extend({}, $.fn.veda_time.defaults, options);
            var control = veda_dateTime.call(this, opts);
            var tabindex = this.attr('tabindex');

            if (tabindex) {
              this.removeAttr('tabindex');
              control.find('input').attr('tabindex', tabindex);
            }

            this.append(control);
            return this;
          };

          $.fn.veda_time.defaults = {
            template: $('#datetime-control-template').html(),
            parser: function parser(input) {
              if (input) {
                var timestamp = moment(input, 'HH:mm').toDate();
                var result = new Date(timestamp);
                result.setFullYear(1970);
                result.setMonth(0);
                result.setDate(1);
                return result;
              }

              return null;
            },
            format: 'HH:mm'
          }; // Date-Time control

          $.fn.veda_dateTime = function (options) {
            var opts = $.extend({}, $.fn.veda_dateTime.defaults, options);
            var control = veda_dateTime.call(this, opts);
            var tabindex = this.attr('tabindex');

            if (tabindex) {
              this.removeAttr('tabindex');
              control.find('input').attr('tabindex', tabindex);
            }

            this.append(control);
            return this;
          };

          $.fn.veda_dateTime.defaults = {
            template: $('#datetime-control-template').html(),
            parser: function parser(input) {
              if (input) {
                var timestamp = moment(input, 'DD.MM.YYYY HH:mm').toDate();
                var absolutDate = new Date(timestamp);

                if (absolutDate.getUTCHours() + absolutDate.getUTCMinutes() + absolutDate.getUTCSeconds() === 0) {
                  absolutDate.setSeconds(1);
                }

                return absolutDate;
              }

              return null;
            },
            format: 'DD.MM.YYYY HH:mm'
          };
        });
      });
      ;
      veda_multilingual.defaults = {
        parser: function parser(input, el) {
          if (input) {
            var value = String(input);
            var lang = $(el).attr('lang');

            if (lang) {
              value = value + '@' + lang;
            }

            return value;
          }

          return null;
        }
      }; // Multilingual string control

      $.fn.veda_multilingualString = function (options) {
        var opts = $.extend({}, $.fn.veda_multilingualString.defaults, options);
        var self = $(this);

        var init = function init() {
          self.empty();
          veda_multilingual.call(self, opts);
        };

        init();
        veda.on('language:changed', init);
        self.one('remove', function () {
          veda.off('language:changed', init);
        });
        return this;
      };

      $.fn.veda_multilingualString.defaults = {
        template: $('#multilingual-string-control-template').html()
      }; // Multilingual text control

      $.fn.veda_multilingualText = function (options) {
        var opts = $.extend({}, $.fn.veda_multilingualText.defaults, options);
        var self = $(this);

        var init = function init() {
          self.empty();
          veda_multilingual.call(self, opts);
          var ta = $('textarea', self);
          ta.attr('rows', self.attr('rows'));
          autosize(ta);
          self.on('edit', function () {
            autosize.update(ta);
          });
          self.one('remove', function () {
            autosize.destroy(ta);
          });
        };

        init();
        veda.on('language:changed', init);
        self.one('remove', function () {
          veda.off('language:changed', init);
        });
        return this;
      };

      $.fn.veda_multilingualText.defaults = {
        template: $('#multilingual-text-control-template').html()
      }; // BOOLEAN CONTROL

      $.fn.veda_boolean = function (options) {
        var opts = $.extend({}, $.fn.veda_boolean.defaults, options);
        var control = $(opts.template);
        var individual = opts.individual;
        var property_uri = opts.property_uri;
        var spec = opts.spec;
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.attr('tabindex', tabindex);
        }

        var handler = function handler(doc_property_uri) {
          if (individual.hasValue(property_uri)) {
            if (individual.get(property_uri)[0] === true) {
              control.prop('checked', true).prop('readonly', false).prop('indeterminate', false);
            } else {
              control.prop('checked', false).prop('readonly', false).prop('indeterminate', false);
            }
          } else {
            control.prop('readonly', true).prop('indeterminate', true);
          }
        };

        handler();
        individual.on(property_uri, handler);
        this.one('remove', function () {
          individual.off(property_uri, handler);
        });
        control.click(function () {
          if (control.prop('readonly')) {
            individual.set(property_uri, [false]);
          } else if (!control.prop('checked')) {
            individual.set(property_uri, []);
          } else {
            individual.set(property_uri, [true]);
          }
        });

        if (control.closest('.checkbox.disabled').length) {
          control.attr('disabled', 'disabled');
        }

        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'view') {
            control.attr('disabled', 'disabled');
          } else {
            if (control.closest('.checkbox.disabled').length) {
              control.attr('disabled', 'disabled');
            } else {
              control.removeAttr('disabled');
            }

            if (spec && spec.hasValue('v-ui:tooltip')) {
              control.parents('label').tooltip({
                title: spec['v-ui:tooltip'].join(', '),
                placement: 'bottom',
                container: control,
                trigger: 'hover',
                animation: false
              });
            }
          }
        });
        this.append(control);
        return this;
      };

      $.fn.veda_boolean.defaults = {
        template: $('#boolean-control-template').html()
      }; // ACTOR CONTROL

      $.fn.veda_actor = function (options) {
        var opts = $.extend({}, $.fn.veda_actor.defaults, options);
        var control = $(opts.template);
        var individual = opts.individual;
        var rel_uri = opts.property_uri;
        var spec = opts.spec;
        var placeholder = this.attr('data-placeholder') || (spec && spec.hasValue('v-ui:placeholder') ? spec['v-ui:placeholder'].map(Util.formatValue).join(' ') : new veda.IndividualModel('v-s:StartTypingBundle'));
        var specQueryPrefix = this.attr('data-query-prefix') || (spec && spec.hasValue('v-ui:queryPrefix') ? spec['v-ui:queryPrefix'][0].toString() : undefined);
        var queryPrefix;
        var sort = this.attr('data-sort') || spec && spec.hasValue('v-ui:sort') && spec['v-ui:sort'][0].toString();
        var actorType = this.attr('data-actor-type') || 'v-s:Appointment v-s:Person v-s:Position v-s:Department';
        var complex = this.attr('data-complex') || false;
        var isSingle = this.attr('data-single') || (spec && spec.hasValue('v-ui:maxCardinality') ? spec['v-ui:maxCardinality'][0] === 1 : true);
        var withDeleted = false || this.attr('data-deleted');
        var chosenActorType;
        var fullName;
        var onlyDeleted;
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.find('textarea').attr('tabindex', tabindex);
        } // Fulltext search feature


        var fulltext = $('.fulltext', control);
        var fulltextMenu = $('.fulltext-menu', control); // Disable closing actor type dropdown on click

        $('.dropdown-menu', control).click(function (e) {
          e.stopPropagation();
        }); // Close actor type dropdown on input click

        fulltext.click(function () {
          $('.dropdown-toggle', control).attr('aria-expanded', false).parent().removeClass('open');
        }); // Filter allowed actor types, set label & handler

        $('[name=\'actor-type\']', control).filter(function (i, el) {
          if (actorType.indexOf(el.value) < 0) {
            $(el).closest('.radio').remove();
            return false;
          } else {
            $(el).parent().append(new veda.IndividualModel(el.value).toString());
            return true;
          }
        }).change(function (e) {
          $('.tree', control).hide();

          if ($(e.target).is(':checked')) {
            chosenActorType = e.target.value;

            if (chosenActorType === 'v-s:Appointment' || chosenActorType === 'v-s:Person' || chosenActorType === 'v-s:Position') {
              $('[name=\'full-name\']', control).parent().parent().show();
              queryPrefix = '\'rdf:type\' === \'v-s:Appointment\'';
            } else if (chosenActorType === 'v-s:Department') {
              $('[name=\'full-name\']', control).parent().parent().hide();
              queryPrefix = '\'rdf:type\' === \'v-s:Appointment\' || \'rdf:type\' === \'v-s:Department\'';
              $('.tree', control).show();
            }

            queryPrefix = specQueryPrefix || queryPrefix;
            var ftValue = $('.fulltext', control).val();

            if (ftValue) {
              performSearch(ftValue);
            }
          }
        }).first().prop('checked', 'checked').change(); // Full name check label & handler

        $('[name=\'full-name\']', control).each(function (i, el) {
          var label = new veda.IndividualModel(el.value);
          var self = el;
          label.load().then(function (label) {
            $(self).parent().append(new veda.IndividualModel(self.value).toString());
          });
        }).change(function () {
          fullName = $(el).is(':checked') ? true : false;
          var ftValue = $('.fulltext', control).val();

          if (ftValue) {
            performSearch(ftValue);
          }
        });
        $('[name=\'only-deleted\']', control).each(function (i, el) {
          var label = new veda.IndividualModel(el.value);
          var self = el;
          label.load().then(function (label) {
            $(self).parent().append(new veda.IndividualModel(self.value).toString());
          });
        }).change(function () {
          onlyDeleted = $(el).is(':checked') ? true : false;
          var ftValue = $('.fulltext', control).val();

          if (ftValue) {
            performSearch(ftValue);
          }
        });
        $('.clear', control).on('click keydown', function (e) {
          if (isSingle) {
            if (e.type !== 'click' && e.which !== 13 && e.which !== 32) {
              return;
            }

            e.preventDefault();
            e.stopPropagation();
            individual.clearValue(rel_uri);

            if (complex) {
              individual.clearValue(rel_uri + '.v-s:employee');
              individual.clearValue(rel_uri + '.v-s:occupation');
            }
          }

          fulltextMenu.hide();
          $(document).off('click', clickOutsideMenuHandler);
          $(document).off('keydown', arrowHandler);
          fulltext.val('').focus();
        }); // Tree feature

        $('.tree', control).on('click keydown', function (e) {
          var treeTmpl = new veda.IndividualModel('v-ui:TreeTemplate');
          var modal = $('#individual-modal-template').html();

          if (e.type !== 'click' && e.which !== 13 && e.which !== 32) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();
          var $modal = $(modal);
          var cntr = $('.modal-body', $modal);
          $modal.on('hidden.bs.modal', function (e) {
            $modal.remove();
          });
          $modal.modal();
          $('body').append($modal);
          var extra = {
            target: individual,
            target_rel_uri: rel_uri,
            isSingle: isSingle,
            withDeleted: withDeleted,
            sort: sort
          };
          spec.present(cntr, treeTmpl, undefined, extra);
        });

        if (_instanceof(placeholder, veda.IndividualModel)) {
          placeholder.load().then(function (placeholder) {
            fulltext.attr({
              'placeholder': placeholder.toString(),
              'name': (individual.hasValue('rdf:type') ? individual['rdf:type'][0].id + '_' + rel_uri : rel_uri).toLowerCase().replace(/[-:]/g, '_')
            });
          });
        } else {
          fulltext.attr({
            'placeholder': placeholder,
            'name': (individual.hasValue('rdf:type') ? individual['rdf:type'][0].id + '_' + rel_uri : rel_uri).toLowerCase().replace(/[-:]/g, '_')
          });
        }

        fulltext.on('input change focus blur', function (e) {
          var fulltext = $(e.target);
          var value = fulltext.val();

          if (value) {
            var rows = value.split('\n').length;
            fulltext.prop('rows', rows);
          } else {
            fulltext.prop('rows', 1);
          }
        });
        var header = $('.header', control);
        Promise.all([new veda.IndividualModel('v-s:SelectAll').load(), new veda.IndividualModel('v-s:CancelSelection').load(), new veda.IndividualModel('v-s:InvertSelection').load()]).then(function (actions) {
          header.find('.select-all').click(function () {
            suggestions.children(':not(.selected)').click();
          }).text(actions[0].toString());
          header.find('.cancel-selection').click(function () {
            suggestions.children('.selected').click();
          }).text(actions[1].toString());
          header.find('.invert-selection').click(function () {
            suggestions.children().click();
          }).text(actions[2].toString());
          header.find('.close-menu').click(function () {
            setValue(selected);
            fulltextMenu.hide();
            $(document).off('click', clickOutsideMenuHandler);
            $(document).off('keydown', arrowHandler);
          }).text('Ok');
        });

        if (isSingle) {
          header.hide();
        }

        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'search') {
            var _isSingle = false || $(e.delegateTarget).data('single');

            if (_isSingle) {
              header.hide();
            } else {
              header.show();
            }
          }
        });

        var inputHandler = function () {
          var timeout;
          var minLength = 3;
          var nav_keys = [37, 38, 39, 40, 9, 16]; // Arrows, shift, tab

          return function (e) {
            if (timeout) {
              clearTimeout(timeout);
            }

            if (nav_keys.indexOf(e.which) >= 0) {
              return;
            }

            timeout = setTimeout(function () {
              var value = e.target.value;

              if (value.length >= minLength) {
                performSearch(value);
              } else if (!value.length) {
                if (isSingle) {
                  individual.clearValue(rel_uri);
                }

                suggestions.empty();
                fulltextMenu.hide();
                $(document).off('click', clickOutsideMenuHandler);
                $(document).off('keydown', arrowHandler);
              }
            }, 750);
          };
        }();

        fulltext.on('keydown', inputHandler);
        /**
         * Search actors
         * @param {string} value
         * @return {void}
         */

        function performSearch(value) {
          if (chosenActorType === 'v-s:Appointment' || chosenActorType === 'v-s:Person' || chosenActorType === 'v-s:Position') {
            if (fullName) {
              value = value.trim().split('\n').map(function (line) {
                var fullNameProps = ['v-s:employee.v-s:lastName', 'v-s:employee.v-s:firstName', 'v-s:employee.v-s:middleName'];
                var fullNameInput = line.trim().replace(/\s+/g, ' ').split(' ');
                var fullNameQuery = fullNameInput.map(function (token, i) {
                  if (i < 3 && token) {
                    return '\'' + fullNameProps[i] + '\'==\'' + token + '*\'';
                  }
                }).filter(Boolean).join(' && ');
                return fullNameQuery;
              }).join('\n');
            }
          }

          var ftQueryPromise = interpolate(queryPrefix, individual).then(function (queryPrefix) {
            if (onlyDeleted) {
              return ftQuery(queryPrefix + ' && \'v-s:deleted\'==\'true\'', value, sort, withDeleted);
            } else {
              return ftQuery(queryPrefix, value, sort, withDeleted);
            }

            ;
          });
          ftQueryPromise.then(renderResults).catch(function (error) {
            console.log('Fulltext query error', error);
          });
        }

        var selected = [];
        /**
         * Render found search results
         * @param {Array} results
         * @return {void}
         */

        function renderResults(results) {
          selected = individual.get(rel_uri).concat(individual.get(rel_uri + '.v-s:employee'), individual.get(rel_uri + '.v-s:occupation'), individual.get(rel_uri + '.v-s:parentUnit'));

          if (results.length) {
            var renderedPromises = results.map(function (result) {
              var cont = $('<a href=\'#\' class=\'suggestion\'></a>').attr('resource', result.id);

              if (individual.hasValue(rel_uri, result) || individual.hasValue(rel_uri + '.v-s:employee', result) || individual.hasValue(rel_uri + '.v-s:occupation', result) || individual.hasValue(rel_uri + '.v-s:parentUnit', result)) {
                cont.addClass('selected');
              }

              var tmpl;

              if (chosenActorType === 'v-s:Department' && result.hasValue('rdf:type', 'v-s:Appointment')) {
                tmpl = '<span about=\'@\' rel=\'v-s:parentUnit\' data-template=\'v-ui:LabelTemplate\'></span>';
              } else {
                tmpl = '<span about=\'@\' property=\'rdfs:label\'></span>';
              }

              return result.present(cont, tmpl).then(function () {
                return cont;
              });
            });
            Promise.all(renderedPromises).then(function (rendered) {
              rendered = rendered.sort(function (a, b) {
                return a.text() < b.text() ? -1 : 1;
              }).reduce(function (acc, curr) {
                if (!acc.length || acc[acc.length - 1].text() !== curr.text()) {
                  acc.push(curr);
                }

                return acc;
              }, []);
              suggestions.empty().append(rendered);
              $(document).off('click', clickOutsideMenuHandler);
              $(document).off('keydown', arrowHandler);
              fulltextMenu.show();
              $(document).on('click', clickOutsideMenuHandler);
              $(document).on('keydown', arrowHandler);
            }).catch(console.log);
          } else {
            suggestions.empty();
            fulltextMenu.hide();
            $(document).off('click', clickOutsideMenuHandler);
            $(document).off('keydown', arrowHandler);
          }
        }

        var suggestions = $('.suggestions', control);
        var dblTimeout;
        suggestions.on('click', '.suggestion', function (e) {
          e.preventDefault();
          e.stopPropagation();

          if (!e.originalEvent) {
            clickHandler(e);
          } else if (dblTimeout) {
            dblclickHandler(e);
          } else {
            clickHandler(e);
          }
        }).on('keydown', '.suggestion', function (e) {
          if (e.which === 32) {
            e.preventDefault();
            e.stopPropagation();
            clickHandler(e);
          } else if (e.which === 13) {
            e.preventDefault();
            e.stopPropagation();
            dblclickHandler(e);
          }
        }).on('dblclick', '.suggestion', function (e) {
          e.preventDefault();
        });
        /**
         * Click event handler
         * @param {Event} e
         * @return {void}
         */

        function clickHandler(e) {
          e.preventDefault();
          var tmpl = $(e.currentTarget);
          var suggestion_uri = tmpl.attr('resource');

          if (!suggestion_uri) {
            return;
          }

          var suggestion = new veda.IndividualModel(suggestion_uri);
          tmpl.toggleClass('selected');

          if (isSingle) {
            tmpl.siblings().removeClass('selected');
          }

          if (selected.indexOf(suggestion) >= 0) {
            if (isSingle) {
              selected = [suggestion];
              setValue(selected);
              fulltextMenu.hide();
              $(document).off('click', clickOutsideMenuHandler);
              $(document).off('keydown', arrowHandler);
            } else {
              selected = selected.filter(function (value) {
                return value !== suggestion;
              });
            }
          } else {
            if (isSingle) {
              selected = [suggestion];
              setValue(selected);
              fulltextMenu.hide();
              $(document).off('click', clickOutsideMenuHandler);
              $(document).off('keydown', arrowHandler);
            } else {
              selected.push(suggestion);
            }
          }

          dblTimeout = setTimeout(function () {
            dblTimeout = undefined;
          }, 300);
          fulltext.focus();
        }
        /**
         * Double click event handler
         * @param {Event} e
         * @return {void}
         */


        function dblclickHandler(e) {
          e.preventDefault();

          if (!$(e.target).hasClass('selected')) {
            clickHandler(e);
          }

          dblTimeout = clearTimeout(dblTimeout);
          setValue(selected);
          fulltextMenu.hide();
          $(document).off('click', clickOutsideMenuHandler);
          $(document).off('keydown', arrowHandler);
          fulltext.focus();
        }
        /**
         * Click outside menu handler
         * @param {Event} e
         * @return {void}
         */


        function clickOutsideMenuHandler(e) {
          if (!$(e.target).closest(fulltextMenu).length && e.target !== fulltext[0]) {
            if (fulltextMenu.is(':visible')) {
              if (selected.length) {
                setValue(selected);
              }

              fulltextMenu.hide();
              $(document).off('click', clickOutsideMenuHandler);
              $(document).off('keydown', arrowHandler);
            }
          }
        }
        /**
         * Arrow press handler
         * @param {Event} e
         * @return {void}
         */


        function arrowHandler(e) {
          if (e.which === 40) {
            // Down
            e.preventDefault();
            e.stopPropagation();
            var active = suggestions.find('.active').removeClass('active');
            var next = active.next();

            if (next.length) {
              next.addClass('active').focus();
            } else {
              suggestions.children().first().addClass('active').focus();
            }
          } else if (e.which === 38) {
            // Up
            e.preventDefault();
            e.stopPropagation();

            var _active = suggestions.find('.active').removeClass('active');

            var prev = _active.prev();

            if (prev.length) {
              prev.addClass('active').focus();
            } else {
              suggestions.children().last().addClass('active').focus();
            }
          } else if (e.which === 32 && fulltextMenu.find(':focus').length) {
            // Space
            e.preventDefault(); // Prevent scrolling on space
          }
        }
        /**
         * Set property values to individual
         * @param {Array} values
         * @return {void}
         */


        function setValue(values) {
          if (complex) {
            individual.clearValue(rel_uri);
            individual.clearValue(rel_uri + '.v-s:employee');
            individual.clearValue(rel_uri + '.v-s:occupation');
            individual.clearValue(rel_uri + '.v-s:parentUnit');

            if (chosenActorType === 'v-s:Appointment') {
              individual.set(rel_uri, values);
            } else if (chosenActorType === 'v-s:Person') {
              Promise.all(values.map(function (value) {
                if (value.hasValue('rdf:type', 'v-s:Appointment')) {
                  return value['v-s:employee'][0].load();
                } else if (value.hasValue('rdf:type', 'v-s:Person')) {
                  return value;
                }
              })).then(function (persons) {
                individual.set(rel_uri + '.v-s:employee', persons);
              });
            } else if (chosenActorType === 'v-s:Position') {
              Promise.all(values.map(function (value) {
                if (value.hasValue('rdf:type', 'v-s:Appointment')) {
                  return value['v-s:occupation'][0].load();
                } else if (value.hasValue('rdf:type', 'v-s:Position')) {
                  return value;
                }
              })).then(function (positions) {
                individual.set(rel_uri + '.v-s:occupation', positions);
              });
            } else if (chosenActorType === 'v-s:Department') {
              Promise.all(values.map(function (value) {
                if (value.hasValue('rdf:type', 'v-s:Appointment')) {
                  return value['v-s:parentUnit'][0].load();
                } else if (value.hasValue('rdf:type', 'v-s:Department')) {
                  return value;
                }
              })).then(function (departments) {
                individual.set(rel_uri + '.v-s:parentUnit', departments);
              });
            }
          } else {
            individual.clearValue(rel_uri);

            if (chosenActorType === 'v-s:Appointment') {
              individual.set(rel_uri, values);
            } else if (chosenActorType === 'v-s:Person') {
              Promise.all(values.map(function (value) {
                if (value.hasValue('rdf:type', 'v-s:Appointment')) {
                  return value['v-s:employee'][0].load();
                } else if (value.hasValue('rdf:type', 'v-s:Person')) {
                  return value;
                }
              })).then(function (persons) {
                individual.set(rel_uri, persons);
              });
            } else if (chosenActorType === 'v-s:Position') {
              Promise.all(values.map(function (value) {
                if (value.hasValue('rdf:type', 'v-s:Appointment')) {
                  return value['v-s:occupation'][0].load();
                } else if (value.hasValue('rdf:type', 'v-s:Position')) {
                  return value;
                }
              })).then(function (positions) {
                individual.set(rel_uri, positions);
              });
            } else if (chosenActorType === 'v-s:Department') {
              Promise.all(values.map(function (value) {
                if (value.hasValue('rdf:type', 'v-s:Appointment')) {
                  return value['v-s:parentUnit'][0].load();
                } else if (value.hasValue('rdf:type', 'v-s:Department')) {
                  return value;
                }
              })).then(function (departments) {
                individual.set(rel_uri, departments);
              });
            }
          }
        }
        /**
         * Individual property modified event handler
         * @param {Array} values
         * @return {void}
         */


        function propertyModifiedHandler(values) {
          if (isSingle && (individual.hasValue(rel_uri) || individual.hasValue(rel_uri + '.v-s:employee') || individual.hasValue(rel_uri + '.v-s:occupation') || individual.hasValue(rel_uri + '.v-s:parentUnit'))) {
            var value = individual.get(rel_uri).concat(individual.get(rel_uri + '.v-s:employee'), individual.get(rel_uri + '.v-s:occupation'), individual.get(rel_uri + '.v-s:parentUnit')).filter(Boolean)[0];
            value.load().then(function (value) {
              var newValueStr = value.toString();
              var oldValueStr = fulltext.val();

              if (newValueStr != oldValueStr) {
                fulltext.val(newValueStr);
              }
            });
          } else {
            fulltext.val('');
          }
        }

        individual.on([rel_uri, rel_uri + '.v-s:employee', rel_uri + '.v-s:occupation', rel_uri + '.v-s:parentUnit'].join(' '), propertyModifiedHandler);
        control.one('remove', function () {
          [rel_uri, rel_uri + '.v-s:employee', rel_uri + '.v-s:occupation', rel_uri + '.v-s:parentUnit'].forEach(function (prop) {
            return individual.off(prop, propertyModifiedHandler);
          });
        });
        propertyModifiedHandler();
        this.on('view edit search', function (e) {
          e.stopPropagation();
        });
        this.append(control);
        return this;
      };

      $.fn.veda_actor.defaults = {
        template: $('#actor-control-template').html()
      }; // SELECT CONTROL

      $.fn.veda_select = function (params) {
        var opts = $.extend({}, $.fn.veda_select.defaults, params);
        var control = $(opts.template);
        var individual = opts.individual;
        var property_uri = opts.property_uri || opts.rel_uri;
        var spec = opts.spec;
        var first_opt = $('option', control);
        var rangeRestriction = spec && spec.hasValue('v-ui:rangeRestriction') ? spec['v-ui:rangeRestriction'][0] : undefined;
        var range = rangeRestriction ? [rangeRestriction] : new veda.IndividualModel(property_uri)['rdfs:range'];
        var queryPrefix = this.attr('data-query-prefix') || (spec && spec.hasValue('v-ui:queryPrefix') ? spec['v-ui:queryPrefix'][0] : range.map(function (item) {
          return '\'rdf:type\'===\'' + item.id + '\'';
        }).join(' || '));
        var sort = this.attr('data-sort') || spec && spec.hasValue('v-ui:sort') && spec['v-ui:sort'][0].toString();
        var placeholder = this.attr('placeholder') || (spec && spec.hasValue('v-ui:placeholder') ? spec['v-ui:placeholder'].map(Util.formatValue).join(' ') : new veda.IndividualModel('v-s:SelectValueBundle'));
        var source = this.attr('data-source') || undefined;
        var template = this.attr('data-template') || '{@.rdfs:label}';
        var options = [];
        var isSingle = this.attr('data-single') || (spec && spec.hasValue('v-ui:maxCardinality') ? spec['v-ui:maxCardinality'][0] === 1 : true);
        var withDeleted = false || this.attr('data-deleted');

        if (_instanceof(placeholder, veda.IndividualModel)) {
          placeholder.load().then(function (placeholderLoaded) {
            placeholder = placeholderLoaded.toString();
            populate();
          });
        } else {
          populate();
        }

        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.attr('tabindex', tabindex);
        }

        control.on('mousedown', function (e) {
          populate();
        });
        control.change(function (e) {
          var value = $('option:selected', control).data('value');

          if (isSingle) {
            individual.set(property_uri, [value]);
          } else {
            if (!individual.hasValue(property_uri, value)) {
              individual.addValue(property_uri, value);
            }

            $(e.delegateTarget).children(':first').prop('selected', true);
          }
        });
        individual.on(property_uri, handler);
        control.one('remove', function () {
          individual.off(property_uri, handler);
        });

        if (template) {
          this.removeAttr('data-template');
        }
        /**
         * Populate options list
         * @return {Promise}
         */


        function populate() {
          if (spec && spec.hasValue('v-ui:optionValue')) {
            options = spec['v-ui:optionValue'];
            return renderOptions(options);
          } else if (source) {
            return Promise.resolve(eval(source)).then(renderOptions).catch(function (error) {
              console.log('Source error', source);
            });
          } else if (queryPrefix) {
            return interpolate(queryPrefix, individual).then(function (queryPrefix) {
              return ftQuery(queryPrefix, undefined, sort, withDeleted);
            }).then(renderOptions).catch(function (error) {
              console.log('Query prefix error', queryPrefix);
            });
          }
        }
        /**
         * Render options list
         * @param {Array} options
         * @return {Promise}
         */


        function renderOptions(options) {
          control.empty();
          first_opt.text(placeholder).data('value', null).appendTo(control);
          var optionsPromises = options.map(function (value, index) {
            if (index >= 100) {
              return;
            }

            var opt = first_opt.clone().appendTo(control);
            return renderValue(value, template).then(function (rendered) {
              opt.text(rendered).data('value', value);

              if (_instanceof(value, veda.IndividualModel) && value.hasValue('v-s:deleted', true)) {
                opt.addClass('deleted');
              }

              if (isSingle && individual.hasValue(property_uri, value)) {
                opt.prop('selected', true);
              }

              return rendered;
            });
          });
          return Promise.all(optionsPromises);
        }
        /**
         * Individual property modified handler to indicate chosen option
         * @return {void}
         */


        function handler() {
          if (isSingle) {
            populate().then(function () {
              $('option', control).each(function (i, el) {
                var value = $(el).data('value');
                var hasValue = !!value && individual.hasValue(property_uri, value);
                $(el).prop('selected', hasValue);
              });
            });
          }
        }

        if (spec && spec.hasValue('v-ui:tooltip')) {
          control.tooltip({
            title: spec['v-ui:tooltip'].join(', '),
            placement: 'top',
            container: 'body',
            trigger: 'hover',
            animation: false
          });
          control.one('remove', function () {
            control.tooltip('destroy');
          });
        }

        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'search') {
            var dataDeleted = $(e.delegateTarget).data('deleted');
            withDeleted = typeof dataDeleted === 'boolean' ? dataDeleted : true;
          }
        });
        this.on('update', function (e) {
          e.stopPropagation();
          populate();
        });
        this.append(control);
        return this;
      };

      $.fn.veda_select.defaults = {
        template: $('#select-control-template').html()
      }; // CHECKBOX GROUP CONTROL

      $.fn.veda_checkbox = function (params) {
        var opts = $.extend({}, $.fn.veda_checkbox.defaults, params);
        var self = this;
        var individual = opts.individual;
        var property_uri = opts.property_uri || opts.rel_uri;
        var spec = opts.spec;
        var rangeRestriction = spec && spec.hasValue('v-ui:rangeRestriction') ? spec['v-ui:rangeRestriction'][0] : undefined;
        var range = rangeRestriction ? [rangeRestriction] : new veda.IndividualModel(property_uri)['rdfs:range'];
        var queryPrefix = this.attr('data-query-prefix') || (spec && spec.hasValue('v-ui:queryPrefix') ? spec['v-ui:queryPrefix'][0] : range.map(function (item) {
          return '\'rdf:type\'===\'' + item.id + '\'';
        }).join(' || '));
        var sort = this.attr('data-sort') || spec && spec.hasValue('v-ui:sort') && spec['v-ui:sort'][0].toString();
        var source = this.attr('data-source') || undefined;
        var template = this.attr('data-template') || '{@.rdfs:label}';
        var options = [];
        var withDeleted = false || this.attr('data-deleted');
        populate();
        individual.on(property_uri, handler);
        this.one('remove', function () {
          individual.off(property_uri, handler);
        });

        if (template) {
          this.removeAttr('data-template');
        }
        /**
         * Populate options list
         * @return {Promise}
         */


        function populate() {
          if (spec && spec.hasValue('v-ui:optionValue')) {
            options = spec['v-ui:optionValue'];
            return renderOptions(options);
          } else if (source) {
            return Promise.resolve(eval(source)).then(renderOptions).catch(function (error) {
              console.log('Source error', source);
            });
          } else if (queryPrefix) {
            return interpolate(queryPrefix, individual).then(function (queryPrefix) {
              return ftQuery(queryPrefix, undefined, sort, withDeleted);
            }).then(renderOptions).catch(function (error) {
              console.log('Query prefix error', queryPrefix);
            });
          }
        }
        /**
         * Render options list
         * @param {Array} options
         * @return {Promise}
         */


        function renderOptions(options) {
          self.empty();
          var optionsPromises = options.map(function (value, index) {
            if (index >= 100) {
              return;
            }

            var hld = $(opts.template).appendTo(self);
            return renderValue(value, template).then(function (rendered) {
              var lbl = $('label', hld).append(rendered);
              var chk = $('input', lbl).data('value', value);

              if (_instanceof(value, veda.IndividualModel) && value.hasValue('v-s:deleted', true)) {
                hld.addClass('deleted');
              }

              var hasValue = individual.hasValue(property_uri, value);
              chk.prop('checked', hasValue);
              chk.change(function () {
                if (chk.is(':checked')) {
                  individual.addValue(property_uri, value);
                } else {
                  individual.removeValue(property_uri, value);
                }
              });

              if (opts.mode === 'view') {
                hld.addClass('disabled');
                chk.attr('disabled', 'disabled');
              }
            });
          });
          return Promise.all(optionsPromises);
        }
        /**
         * Individual property modified handler to indicate chosen option
         * @return {void}
         */


        function handler() {
          $('input', self).each(function (i, el) {
            var value = $(el).data('value');
            var hasValue = individual.hasValue(property_uri, value);
            $(el).prop('checked', hasValue);
          });
        }

        if (spec && spec.hasValue('v-ui:tooltip')) {
          this.tooltip({
            title: spec['v-ui:tooltip'].join(', '),
            placement: 'left',
            container: 'body',
            trigger: 'hover',
            animation: false
          }).one('remove', function (e) {
            $(e.delegateTarget).tooltip('destroy');
          });
        }

        this.on('update', function (e) {
          e.stopPropagation();
          populate();
        });
        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'view') {
            $(e.delegateTarget).children().addClass('disabled');
            $('input', e.delegateTarget).attr('disabled', 'true');
          } else {
            $(e.delegateTarget).children().removeClass('disabled');
            $('input', e.delegateTarget).removeAttr('disabled');
          }

          if (e.type === 'search') {
            var dataDeleted = $(e.delegateTarget).data('deleted');
            withDeleted = typeof dataDeleted === 'boolean' ? dataDeleted : true;
          }
        });
        return this;
      };

      $.fn.veda_checkbox.defaults = {
        template: $('#checkbox-control-template').html()
      }; // RADIO GROUP CONTROL

      $.fn.veda_radio = function (params) {
        var opts = $.extend({}, $.fn.veda_radio.defaults, params);
        var self = this;
        var individual = opts.individual;
        var property_uri = opts.property_uri || opts.rel_uri;
        var spec = opts.spec;
        var rangeRestriction = spec && spec.hasValue('v-ui:rangeRestriction') ? spec['v-ui:rangeRestriction'][0] : undefined;
        var range = rangeRestriction ? [rangeRestriction] : new veda.IndividualModel(property_uri)['rdfs:range'];
        var queryPrefix = this.attr('data-query-prefix') || (spec && spec.hasValue('v-ui:queryPrefix') ? spec['v-ui:queryPrefix'][0] : range.map(function (item) {
          return '\'rdf:type\'===\'' + item.id + '\'';
        }).join(' || '));
        var sort = this.attr('data-sort') || spec && spec.hasValue('v-ui:sort') && spec['v-ui:sort'][0].toString();
        var source = this.attr('data-source') || undefined;
        var template = this.attr('data-template') || '{@.rdfs:label}';
        var options = [];
        var withDeleted = false || this.attr('data-deleted');
        populate();
        individual.on(property_uri, handler);
        this.one('remove', function () {
          individual.off(property_uri, handler);
        });

        if (template) {
          this.removeAttr('data-template');
        }
        /**
         * Populate options list
         * @return {Promise}
         */


        function populate() {
          if (spec && spec.hasValue('v-ui:optionValue')) {
            options = spec['v-ui:optionValue'];
            return renderOptions(options);
          } else if (source) {
            return Promise.resolve(eval(source)).then(renderOptions).catch(function (error) {
              console.log('Source error', source);
            });
          } else if (queryPrefix) {
            return interpolate(queryPrefix, individual).then(function (queryPrefix) {
              return ftQuery(queryPrefix, undefined, sort, withDeleted);
            }).then(renderOptions).catch(function (error) {
              console.log('Query prefix error', queryPrefix);
            });
          }
        }
        /**
         * Render options list
         * @param {Array} options
         * @return {void}
         */


        function renderOptions(options) {
          self.empty();
          options.forEach(function (value, index) {
            if (index >= 100) {
              return;
            }

            var hld = $(opts.template).appendTo(self);
            return renderValue(value, template).then(function (rendered) {
              var lbl = $('label', hld).append(rendered);
              var rad = $('input', lbl).data('value', value);

              if (_instanceof(value, veda.IndividualModel) && value.hasValue('v-s:deleted', true)) {
                hld.addClass('deleted');
              }

              var hasValue = individual.hasValue(property_uri, value);
              rad.prop('checked', hasValue);
              rad.change(function () {
                if (rad.is(':checked')) {
                  individual.set(property_uri, [value]);
                } else {
                  individual.removeValue(property_uri, value);
                }
              });

              if (opts.mode === 'view') {
                hld.addClass('disabled');
                rad.attr('disabled', 'disabled');
              }
            });
          });
        }
        /**
         * Individual property modified handler to indicate chosen option
         * @return {void}
         */


        function handler() {
          $('input', self).each(function (i, el) {
            var value = $(el).data('value');
            var hasValue = individual.hasValue(property_uri, value);
            $(el).prop('checked', hasValue);
          });
        }

        if (spec && spec.hasValue('v-ui:tooltip')) {
          this.tooltip({
            title: spec['v-ui:tooltip'].join(', '),
            placement: 'left',
            container: 'body',
            trigger: 'hover',
            animation: false
          }).one('remove', function (e) {
            $(e.delegateTarget).tooltip('destroy');
          });
        }

        this.on('update', function (e) {
          e.stopPropagation();
          populate();
        });
        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'view') {
            $('div.radio', e.delegateTarget).addClass('disabled');
            $('input', e.delegateTarget).attr('disabled', 'true');
          } else {
            $('div.radio', e.delegateTarget).removeClass('disabled');
            $('input', e.delegateTarget).removeAttr('disabled');
          }

          if (e.type === 'search') {
            var dataDeleted = $(e.delegateTarget).data('deleted');
            withDeleted = typeof dataDeleted === 'boolean' ? dataDeleted : true;
          }
        });
        return this;
      };

      $.fn.veda_radio.defaults = {
        template: $('#radio-control-template').html()
      }; // BOOLEAN RADIO

      $.fn.veda_booleanRadio = function (params) {
        var opts = $.extend({}, $.fn.veda_booleanRadio.defaults, params);
        var self = this;
        var individual = opts.individual;
        var property_uri = opts.property_uri || opts.rel_uri;
        var spec = opts.spec;
        var trueOption = {
          label: spec && spec.hasValue('v-ui:trueLabel') ? Promise.resolve(spec.get('v-ui:trueLabel').map(Util.formatValue).join(' ')) : new veda.IndividualModel('v-s:YesBundle').load().then(function (loaded) {
            return loaded.get('rdfs:label').map(Util.formatValue).join(' ');
          }),
          value: true
        };
        var falseOption = {
          label: spec && spec.hasValue('v-ui:falseLabel') ? Promise.resolve(spec.get('v-ui:falseLabel').map(Util.formatValue).join(' ')) : new veda.IndividualModel('v-s:NoBundle').load().then(function (loaded) {
            return loaded.get('rdfs:label').map(Util.formatValue).join(' ');
          }),
          value: false
        };
        var options = [trueOption, falseOption];
        renderOptions();
        individual.on(property_uri, handler);
        this.one('remove', function () {
          individual.off(property_uri, handler);
        });
        /**
         * Render options list
         * @param {Array} options
         * @return {void}
         */

        function renderOptions() {
          self.empty();
          options.map(function (option) {
            var hld = $(opts.template).appendTo(self);
            option.label.then(function (label) {
              var lbl = $('label', hld).append(label);
              var rad = $('input', lbl).data('value', option.value);
              var hasValue = individual.hasValue(property_uri, option.value);
              rad.prop('checked', hasValue);
              rad.change(function () {
                if (rad.is(':checked')) {
                  individual.set(property_uri, [rad.data('value')]);
                } else {
                  individual.set(property_uri, individual.get(property_uri).filter(function (i) {
                    return i.valueOf() !== rad.data('value').valueOf();
                  }));
                }
              });
            });
          });
        }
        /**
         * Individual property modified handler to indicate chosen option
         * @return {void}
         */


        function handler() {
          $('input', self).each(function (i, el) {
            var value = $(el).data('value');
            var hasValue = individual.hasValue(property_uri, value);
            $(el).prop('checked', hasValue);
          });
        }

        if (spec && spec.hasValue('v-ui:tooltip')) {
          this.tooltip({
            title: spec['v-ui:tooltip'].join(', '),
            placement: 'left',
            container: 'body',
            trigger: 'hover',
            animation: false
          }).one('remove', function (e) {
            $(e.delegateTarget).tooltip('destroy');
          });
        }

        this.on('update', function (e) {
          e.stopPropagation();
          renderOptions();
        });
        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'view') {
            $('div.radio', e.delegateTarget).addClass('disabled');
            $('input', e.delegateTarget).attr('disabled', 'true');
            $(e.delegateTarget).removeClass('has-error');
          } else {
            $('div.radio', e.delegateTarget).removeClass('disabled');
            $('input', e.delegateTarget).removeAttr('disabled');
          }
        });
        return this;
      };

      $.fn.veda_booleanRadio.defaults = {
        template: $('#radio-control-template').html()
      }; // SOURCE CODE CONTROL

      $.fn.veda_source = function (options) {
        var _this = this;

        var opts = $.extend({}, $.fn.veda_source.defaults, options);
        var control = $(opts.template);
        var individual = opts.individual;
        var property_uri = opts.property_uri;
        var editorEl = control.get(0);
        opts.value = individual.hasValue(property_uri) ? individual.get(property_uri)[0].toString() : '';

        opts.change = function (value) {
          individual.set(property_uri, [value]);
        };

        if (typeof this.attr('data-mode') !== 'undefined') opts.sourceMode = this.attr('data-mode');
        if (property_uri === 'v-s:script') opts.sourceMode = 'ace/mode/javascript';
        if (property_uri === 'v-ui:template') opts.sourceMode = 'ace/mode/html';

        var debounce = function debounce(f, ms) {
          var skip = false;
          return function () {
            if (skip) return;
            skip = true;
            setTimeout(function () {
              return skip = false;
            }, ms);
            return f.apply(void 0, arguments);
          };
        };

        System.import('ace').then(function (module) {
          var ace = module.default;
          var editor = ace.edit(editorEl, {
            mode: opts.sourceMode,
            readOnly: opts.mode === 'view',
            selectionStyle: 'text',
            fontSize: 14,
            value: opts.value
          });

          _this.on('view edit search', function (e) {
            e.stopPropagation();
            e.type === 'view' ? editor.setReadOnly(true) : e.type === 'edit' ? editor.setReadOnly(false) : e.type === 'search' ? editor.setReadOnly(false) : true;
          });

          var editorHandler = function editorHandler(delta) {
            var value = opts.parser(editor.session.getValue());
            opts.change(value);
          };

          var debouncedEditorHandler = debounce(editorHandler, 100);
          editor.session.on('change', debouncedEditorHandler);

          var individualHandler = function individualHandler(values) {
            var value = opts.parser(editor.session.getValue());

            if (!values.length || values[0].toString() !== value) {
              editor.setValue(values.length ? values[0].toString() : '');
            }
          };

          var debouncedIndividualHandler = debounce(individualHandler, 100);
          individual.on(property_uri, debouncedIndividualHandler);

          _this.one('remove', function () {
            individual.off(property_uri, debouncedIndividualHandler);
            editor.destroy();
          });
        });
        this.on('view edit search', function (e) {
          e.stopPropagation();
        });
        this.append(control);
        return this;
      };

      $.fn.veda_source.defaults = {
        value: '',
        template: $('#source-control-template').html(),
        mode: 'javascript',
        parser: function parser(input) {
          return input || null;
        }
      };
      ;

      $.fn.veda_file = function (options) {
        var opts = $.extend({}, $.fn.veda_file.defaults, options);
        var control = $(opts.template);
        var fileInput = control.find('input');
        var indicatorPercentage = $('.indicator-percentage', control);
        var indicatorSpinner = $('.indicator-spinner', control);
        var spec = opts.spec;
        var individual = opts.individual;
        var rel_uri = opts.property_uri;
        var rangeRestriction = spec && spec.hasValue('v-ui:rangeRestriction') ? spec['v-ui:rangeRestriction'][0] : undefined;
        var range = rangeRestriction ? [rangeRestriction] : new veda.IndividualModel(rel_uri)['rdfs:range'];
        var isSingle = spec && spec.hasValue('v-ui:maxCardinality') ? spec['v-ui:maxCardinality'][0] === 1 : true;
        var accept = this.attr('accept');
        var maxWidth = this.attr('data-max-width') || 2048;
        var targetRatio = this.attr('data-ratio');

        if (!isSingle) {
          fileInput.attr('multiple', 'multiple');
        }

        if (accept) {
          fileInput.attr('accept', accept);
        }

        var progress = function progress(progressEvent) {
          if (progressEvent.lengthComputable) {
            try {
              var percentComplete = Math.round(progressEvent.loaded / progressEvent.total * 100);
              indicatorPercentage.text(percentComplete + '%').show();
            } catch (err) {
              console.log('Progress indicator error', error);
            }
          } else {
            indicatorSpinner.show();
          }
        };

        var createFileIndividual = function createFileIndividual(file, name, parent) {
          var fileName = file.name || name;
          var uri = veda.Util.guid();
          var path = '/' + new Date().toISOString().substring(0, 10).split('-').join('/');
          var fileIndividual = new veda.IndividualModel();
          fileIndividual['rdf:type'] = range;
          fileIndividual['v-s:fileName'] = [fileName];
          fileIndividual['rdfs:label'] = [fileName];
          fileIndividual['v-s:fileSize'] = [file.size];
          fileIndividual['v-s:fileUri'] = [uri];
          fileIndividual['v-s:filePath'] = [path];
          fileIndividual['v-s:parent'] = [parent];
          return new Promise(function (resolve, reject) {
            // If file is image && !thumbnail
            if (file.name && /^(?!thumbnail-).+\.(jpg|jpeg|gif|png|bmp|svg)$/i.test(file.name)) {
              loadImage(file).then(function (image) {
                if (targetRatio) {
                  var curRatio = image.height / image.width;
                  console.log('curRatio: ', curRatio);

                  if (!(targetRatio - 0.1 < curRatio && curRatio < targetRatio + 0.1)) {
                    return cropImage(image, targetRatio, maxWidth);
                  }

                  ;
                }

                ;
                return image;
              }).then(function (image) {
                if (image === false) {
                  reject(Error('Cropper canceled'));
                } else {
                  file = image;
                  return resizeImage(image, 256).then(function (thumbnail) {
                    createFileIndividual(thumbnail, 'thumbnail-' + fileName, fileIndividual).then(function (thumbnailIndividual) {
                      fileIndividual['v-s:thumbnail'] = [thumbnailIndividual];
                      resolve(fileIndividual);
                    });
                  });
                }

                ;
              });
            } else {
              resolve(fileIndividual);
            }
          }).then(function () {
            return veda.Backend.uploadFile({
              file: file,
              path: path,
              uri: uri,
              progress: progress
            });
          }).then(function () {
            return fileIndividual.save();
          }).catch(function (error) {
            console.log(error);
          });
        };

        fileInput.change(function (e) {
          var self = e.delegateTarget;
          var fileIndividualPromises = [];

          for (var i = 0, file; file = self.files && self.files[i]; i++) {
            var fileIndividualPromise = createFileIndividual(file, undefined, individual);
            fileIndividualPromises.push(fileIndividualPromise);
          }

          if (!fileIndividualPromises.length) {
            return;
          }

          control.addClass('disabled');
          fileInput.attr('disabled', 'disabled');
          Promise.all(fileIndividualPromises).then(function (fileIndividuals) {
            control.removeClass('disabled');
            fileInput.removeAttr('disabled');
            self.value = '';
            indicatorSpinner.empty().hide();
            indicatorPercentage.empty().hide();

            if (isSingle) {
              individual.set(rel_uri, fileIndividuals);
            } else {
              individual.addValue(rel_uri, fileIndividuals);
            }
          }).catch(function (error) {
            console.log(error);
          }).then(function () {
            control.removeClass('disabled');
            fileInput.removeAttr('disabled');
          });
        });
        this.on('view edit search', function (e) {
          e.stopPropagation();
        });
        this.append(control);
        return this;
      };

      $.fn.veda_file.defaults = {
        template: $('#file-control-template').html()
      }; // OBJECT PROPERTY CONTROL

      $.fn.veda_link = function (options) {
        var opts = $.extend({}, $.fn.veda_link.defaults, options);
        var control = $(opts.template);
        var template = this.attr('data-template') || '{@.rdfs:label}';
        var individual = opts.individual;
        var spec = opts.spec;
        var placeholder = this.attr('placeholder') || (spec && spec.hasValue('v-ui:placeholder') ? spec['v-ui:placeholder'].map(Util.formatValue).join(' ') : new veda.IndividualModel('v-s:StartTypingBundle'));
        var rel_uri = opts.property_uri;
        var rangeRestriction = spec && spec.hasValue('v-ui:rangeRestriction') ? spec['v-ui:rangeRestriction'][0] : undefined;
        var range = rangeRestriction ? [rangeRestriction] : new veda.IndividualModel(rel_uri)['rdfs:range'];
        var queryPrefix = this.attr('data-query-prefix') || (spec && spec.hasValue('v-ui:queryPrefix') ? spec['v-ui:queryPrefix'][0].toString() : range.map(function (item) {
          return '\'rdf:type\'===\'' + item.id + '\'';
        }).join(' || '));
        var source = this.attr('data-source') || undefined;
        var sort = this.attr('data-sort') || spec && spec.hasValue('v-ui:sort') && spec['v-ui:sort'][0].toString();
        var isSingle = this.attr('data-single') || (spec && spec.hasValue('v-ui:maxCardinality') ? spec['v-ui:maxCardinality'][0] === 1 : true);
        var withDeleted = false || this.attr('data-deleted');
        var tabindex = this.attr('tabindex');

        if (tabindex) {
          this.removeAttr('tabindex');
          control.find('textarea').attr('tabindex', tabindex);
        }

        if (template) {
          this.removeAttr('data-template');
        } // Select value


        var select = function select(selected) {
          selected = _instanceof(selected, Array) ? selected : [selected];

          if (isSingle) {
            individual.set(rel_uri, [selected[0]]);
          } else {
            var filtered = selected.filter(function (i) {
              return individual.get(rel_uri).indexOf(i) < 0;
            });
            individual.set(rel_uri, individual.get(rel_uri).concat(filtered));
          }
        };

        var createValue = function createValue() {
          var newVal = new veda.IndividualModel();
          newVal['rdf:type'] = rangeRestriction ? [rangeRestriction] : [new veda.IndividualModel(rel_uri)['rdfs:range'][0]];
          return newVal;
        }; // Create feature


        var create = $('.create', control);

        if (this.hasClass('create') || this.hasClass('full')) {
          var inModal = this.hasClass('create-modal');
          var rel_range = rangeRestriction ? rangeRestriction : new veda.IndividualModel(rel_uri)['rdfs:range'][0];
          rel_range.rights.then(function (rights) {
            if (!rights.hasValue('v-s:canCreate', true) && opts.mode !== 'search') {
              create.addClass('disabled');
              create.off('click keyup');
            } else {
              create.on('click keydown', function (e) {
                if (e.type !== 'click' && e.which !== 13 && e.which !== 32) {
                  return;
                }

                e.preventDefault();
                e.stopPropagation();
                var newVal = createValue();

                if (inModal) {
                  var modal = $('#individual-modal-template').html();
                  modal = $(modal).modal({
                    'show': false
                  });
                  $('body').append(modal);
                  modal.modal('show');
                  create.one('remove', function () {
                    modal.modal('hide').remove();
                    $(document).off('keyup', escHandler);
                  });
                  var ok = $('#ok', modal).click(function (e) {
                    select(newVal);
                    $(document).off('keyup', escHandler);
                  });
                  var close = $('.close', modal).click(function (e) {
                    newVal.delete();
                    $(document).off('keyup', escHandler);
                  });

                  var escHandler = function escHandler(e) {
                    if (e.keyCode === 27) {
                      close.click();
                    }
                  };

                  $(document).on('keyup', escHandler);
                  var cntr = $('.modal-body', modal);
                  newVal.one('beforeReset', function () {
                    modal.modal('hide').remove();
                  });
                  newVal.one('afterSave', function () {
                    select(newVal);
                    modal.modal('hide').remove();
                  });
                  newVal.present(cntr, undefined, 'edit').then(function (tmpl) {
                    $('.action', tmpl).remove();
                    var validation = tmpl.data('validation');

                    if (validation && validation.state) {
                      ok.removeAttr('disabled');
                    } else {
                      ok.attr('disabled', 'disabled');
                    }

                    tmpl.on('internal-validated', function (e, validation) {
                      if (validation.state) {
                        ok.removeAttr('disabled');
                      } else {
                        ok.attr('disabled', 'disabled');
                      }
                    });
                  });
                } else {
                  select(newVal);
                }
              });
            }
          }); // Hide create button for single value relations if value exists

          if (isSingle) {
            var singleValueHandler = function singleValueHandler(values) {
              if (values.length) {
                create.hide();
              } else {
                create.show();
              }
            };

            individual.on(rel_uri, singleValueHandler);
            create.one('remove', function () {
              individual.off(rel_uri, singleValueHandler);
            });
            singleValueHandler(individual.get(rel_uri));
          }
        } else {
          create.remove();
        } // Tree feature


        var tree = $('.tree', control);

        if (this.hasClass('tree') || this.hasClass('full')) {
          var treeTmpl = new veda.IndividualModel('v-ui:TreeTemplate');
          var modal = $('#individual-modal-template').html();
          tree.on('click keydown', function (e) {
            if (e.type !== 'click' && e.which !== 13 && e.which !== 32) {
              return;
            }

            e.preventDefault();
            e.stopPropagation();
            var $modal = $(modal);
            var cntr = $('.modal-body', $modal);
            $modal.on('hidden.bs.modal', function (e) {
              $modal.remove();
            });
            $modal.modal();
            $('body').append($modal);
            var extra = {
              target: individual,
              target_rel_uri: rel_uri,
              isSingle: isSingle,
              withDeleted: withDeleted,
              sort: sort
            };
            spec.present(cntr, treeTmpl, undefined, extra);
          });
        } else {
          tree.remove();
        } // Fulltext search feature


        var selected = [];
        var fulltext = $('.fulltext', control);
        var fulltextMenu = $('.fulltext-menu', control);

        if (this.hasClass('fulltext') || this.hasClass('full')) {
          if (_instanceof(placeholder, veda.IndividualModel)) {
            placeholder.load().then(function (placeholder) {
              fulltext.attr({
                'placeholder': placeholder.toString(),
                'name': (individual.hasValue('rdf:type') ? individual['rdf:type'][0].id + '_' + rel_uri : rel_uri).toLowerCase().replace(/[-:]/g, '_')
              });
            });
          } else {
            fulltext.attr({
              'placeholder': placeholder,
              'name': (individual.hasValue('rdf:type') ? individual['rdf:type'][0].id + '_' + rel_uri : rel_uri).toLowerCase().replace(/[-:]/g, '_')
            });
          }

          fulltext.on('input change focus blur', function (e) {
            var fulltext = $(e.target);
            var value = fulltext.val();

            if (value) {
              var rows = value.split('\n').length;
              fulltext.prop('rows', rows);
            } else {
              fulltext.prop('rows', 1);
            }
          });
          var header = $('.header', control);
          Promise.all([new veda.IndividualModel('v-s:SelectAll').load(), new veda.IndividualModel('v-s:CancelSelection').load(), new veda.IndividualModel('v-s:InvertSelection').load()]).then(function (actions) {
            header.find('.select-all').click(function () {
              suggestions.children(':not(.selected)').click();
            }).text(actions[0].toString());
            header.find('.cancel-selection').click(function () {
              suggestions.children('.selected').click();
            }).text(actions[1].toString());
            header.find('.invert-selection').click(function () {
              suggestions.children().click();
            }).text(actions[2].toString());
            header.find('.close-menu').click(function () {
              individual.set(rel_uri, selected);
              fulltextMenu.hide();
              $(document).off('click', clickOutsideMenuHandler);
              $(document).off('keydown', arrowHandler);
            }).text('Ok');
          });

          if (isSingle) {
            header.hide();
          }

          this.on('view edit search', function (e) {
            e.stopPropagation();

            if (e.type === 'search') {
              var _isSingle2 = false || $(e.delegateTarget).data('single');

              if (_isSingle2) {
                header.hide();
              } else {
                header.show();
              }
            }
          });

          var performSearch = function performSearch(value) {
            if (source) {
              return Promise.resolve(eval(source)).then(renderResults).catch(function (error) {
                console.log('Source error', source);
              });
            } else {
              interpolate(queryPrefix, individual).then(function (queryPrefix) {
                ftQuery(queryPrefix, value, sort, withDeleted).then(renderResults).catch(function (error) {
                  console.log('Fulltext query error', error);
                });
              });
            }
          };

          var inputHandler = function () {
            var timeout;
            var minLength = 3;
            var nav_keys = [37, 38, 39, 40, 9, 16]; // Arrows, shift, tab

            return function (e) {
              if (timeout) {
                clearTimeout(timeout);
              }

              if (nav_keys.indexOf(e.which) >= 0) {
                return;
              }

              timeout = setTimeout(function () {
                var value = e.target.value;

                if (value.length >= minLength) {
                  performSearch(value);
                } else if (!value.length) {
                  if (isSingle) {
                    individual.clearValue(rel_uri);
                  }

                  suggestions.empty();
                  fulltextMenu.hide();
                  $(document).off('click', clickOutsideMenuHandler);
                  $(document).off('keydown', arrowHandler);
                }
              }, 750);
            };
          }();

          fulltext.on('keydown', inputHandler);

          var renderResults = function renderResults(results) {
            suggestions.empty();
            selected = individual.get(rel_uri);

            if (results.length) {
              var promises = results.map(function (value) {
                return renderValue(value, template).then(function (rendered) {
                  var tmpl = $('<a href=\'#\' class=\'suggestion\'></a>').text(rendered).attr('resource', value.id);

                  if (individual.hasValue(rel_uri, value)) {
                    tmpl.addClass('selected');
                  }

                  if (value.hasValue('v-s:deleted', true)) {
                    tmpl.addClass('deleted');
                  }

                  if (value.hasValue('v-s:valid', false) && !value.hasValue('v-s:deleted', true)) {
                    tmpl.addClass('invalid');
                  }

                  return tmpl;
                });
              });
              Promise.all(promises).then(function (renderedList) {
                suggestions.append(renderedList);
                $(document).off('click', clickOutsideMenuHandler);
                $(document).off('keydown', arrowHandler);
                fulltextMenu.show();
                $(document).on('click', clickOutsideMenuHandler);
                $(document).on('keydown', arrowHandler);
              });
            } else {
              fulltextMenu.hide();
              $(document).off('click', clickOutsideMenuHandler);
              $(document).off('keydown', arrowHandler);
            }
          };

          var suggestions = $('.suggestions', control);
          var dblTimeout;
          suggestions.on('click', '.suggestion', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!e.originalEvent) {
              clickHandler(e);
            } else if (dblTimeout) {
              dblclickHandler(e);
            } else {
              clickHandler(e);
            }
          }).on('keydown', '.suggestion', function (e) {
            if (e.which === 32) {
              e.preventDefault();
              e.stopPropagation();
              clickHandler(e);
            } else if (e.which === 13) {
              e.preventDefault();
              e.stopPropagation();
              dblclickHandler(e);
            }
          }).on('dblclick', '.suggestion', function (e) {
            e.preventDefault();
          });

          var clickHandler = function clickHandler(e) {
            e.preventDefault();
            var tmpl = $(e.target);
            var suggestion_uri = tmpl.attr('resource');

            if (!suggestion_uri) {
              return;
            }

            var suggestion = new veda.IndividualModel(suggestion_uri);
            tmpl.toggleClass('selected');

            if (isSingle) {
              tmpl.siblings().removeClass('selected');
            }

            if (selected.indexOf(suggestion) >= 0) {
              if (isSingle) {
                individual.set(rel_uri, [suggestion]);
                fulltextMenu.hide();
                $(document).off('click', clickOutsideMenuHandler);
                $(document).off('keydown', arrowHandler);
              } else {
                selected = selected.filter(function (value) {
                  return value !== suggestion;
                });
              }
            } else {
              if (isSingle) {
                selected = [suggestion];
                individual.set(rel_uri, selected);
                fulltextMenu.hide();
                $(document).off('click', clickOutsideMenuHandler);
                $(document).off('keydown', arrowHandler);
              } else {
                selected.push(suggestion);
              }
            }

            dblTimeout = setTimeout(function () {
              dblTimeout = undefined;
            }, 300);
            fulltext.focus();
          };

          var dblclickHandler = function dblclickHandler(e) {
            e.preventDefault();

            if (!$(e.target).hasClass('selected')) {
              clickHandler(e);
            }

            dblTimeout = clearTimeout(dblTimeout);
            individual.set(rel_uri, selected);
            fulltextMenu.hide();
            $(document).off('click', clickOutsideMenuHandler);
            $(document).off('keydown', arrowHandler);
            fulltext.focus();
          };

          var clickOutsideMenuHandler = function clickOutsideMenuHandler(e) {
            if (!$(e.target).closest(fulltextMenu).length) {
              if (fulltextMenu.is(':visible')) {
                individual.set(rel_uri, selected);
                fulltextMenu.hide();
                $(document).off('click', clickOutsideMenuHandler);
                $(document).off('keydown', arrowHandler);
              }
            }
          };

          var arrowHandler = function arrowHandler(e) {
            if (e.which === 40) {
              // Down
              e.preventDefault();
              var active = suggestions.find('.active').removeClass('active');
              var next = active.next();

              if (next.length) {
                next.addClass('active').focus();
              } else {
                suggestions.children().first().addClass('active').focus();
              }
            } else if (e.which === 38) {
              // Up
              e.preventDefault();

              var _active2 = suggestions.find('.active').removeClass('active');

              var prev = _active2.prev();

              if (prev.length) {
                prev.addClass('active').focus();
              } else {
                suggestions.children().last().addClass('active').focus();
              }
            } else if (e.which === 32 && fulltextMenu.find(':focus').length) {
              // Space
              e.preventDefault(); // Prevent scrolling on space
            }
          };

          var propertyModifiedHandler = function propertyModifiedHandler(value) {
            if (isSingle && individual.hasValue(rel_uri)) {
              individual.get(rel_uri)[0].load().then(function (value) {
                return renderValue(value, template);
              }).then(function (rendered) {
                var value = fulltext.val();

                if (value != rendered) {
                  fulltext.val(rendered);
                }
              });
            } else {
              fulltext.val('');
            }
          };

          individual.on(rel_uri, propertyModifiedHandler);
          control.one('remove', function () {
            individual.off(rel_uri, propertyModifiedHandler);
          });
          propertyModifiedHandler(); // Dropdown feature

          var dropdown = $('.dropdown', control);

          if (this.hasClass('dropdown') && this.hasClass('fulltext') || this.hasClass('full')) {
            dropdown.on('click keydown', function (e) {
              if (e.type !== 'click' && e.which !== 13 && e.which !== 32) {
                return;
              }

              e.preventDefault();
              e.stopPropagation();
              var suggestions = $('.suggestions', control);

              if (suggestions.is(':empty')) {
                performSearch();
              } else if (fulltextMenu.is(':visible')) {
                fulltextMenu.hide();
                $(document).off('click', clickOutsideMenuHandler);
                $(document).off('keydown', arrowHandler);
              } else {
                $(document).off('click', clickOutsideMenuHandler);
                $(document).off('keydown', arrowHandler);
                fulltextMenu.show();
                $(document).on('click', clickOutsideMenuHandler);
                $(document).on('keydown', arrowHandler);
              }
            });

            var downHandler = function downHandler(e) {
              if (e.which === 40) {
                e.stopPropagation();
                dropdown.click();
              }
            };

            fulltext.on('focus', function (e) {
              fulltext.off('keydown', downHandler).one('keydown', downHandler);
            });
          } else {
            dropdown.remove();
          }
        } else {
          fulltext.remove();
          fulltextMenu.remove();
          $('.dropdown', control).remove();
        } // Clear feature


        if (isSingle && opts.mode !== 'search' && (this.hasClass('fulltext') || this.hasClass('full'))) {
          $('.clear', control).on('click keydown', function (e) {
            if (e.type !== 'click' && e.which !== 13 && e.which !== 32) {
              return;
            }

            e.preventDefault();
            e.stopPropagation();
            selected = [];
            $('.suggestions', control).empty();
            individual.clearValue(rel_uri);
            fulltext.val('').focus();
          });
          this.on('view edit search', function (e) {
            e.stopPropagation();

            if (e.type === 'search') {
              var _isSingle3 = false || $(e.delegateTarget).data('single');

              if (!_isSingle3) {
                $('.clear', control).remove();
              }
            }
          });
        } else {
          $('.clear', control).remove();
        }

        if (!$('.fulltext', control).length) {
          $('.input-group', control).toggleClass('input-group btn-group');
          $('.input-group-addon', control).toggleClass('input-group-addon btn-default btn-primary');
        }

        this.on('view edit search', function (e) {
          e.stopPropagation();

          if (e.type === 'search') {
            isSingle = false || $(e.delegateTarget).data('single');
            var dataDeleted = $(e.delegateTarget).data('deleted');
            withDeleted = typeof dataDeleted === 'boolean' ? dataDeleted : true;
          }
        });

        if (spec && spec.hasValue('v-ui:tooltip')) {
          control.tooltip({
            title: spec['v-ui:tooltip'].join(', '),
            placement: 'top',
            container: 'body',
            trigger: 'manual',
            animation: false
          });
          control.one('remove', function () {
            control.tooltip('destroy');
          });
          $('textarea', control).on('focusin', function () {
            control.tooltip('show');
          }).on('focusout change', function () {
            control.tooltip('hide');
          });
        }

        this.append(control);
        return this;
      };

      $.fn.veda_link.defaults = {
        template: $('#link-control-template').html()
      };
    }
  };
});
//# sourceMappingURL=veda_controls.js.map