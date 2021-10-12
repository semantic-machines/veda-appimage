"use strict";

System.register(["./check_browser.js", "../common/veda.js", "../common/lib/riot.js", "../common/individual_model.js", "./notify.js", "../common/util.js", "../browser/dom_helpers.js", "../browser/notification_listener.js", "../browser/line_status_listener.js"], function (_export, _context) {
  "use strict";

  var veda, riot, IndividualModel, Notify, Util, delegateHandler;

  function AppPresenter() {
    /**
     * Render individual under mouse pointer with special system template v-ui:ttl
     * when Left mouse button with Ctrl + Alt keys are pressed
     * @param {Event} event
     * @this Element
     */
    function specialTemplateHandler(event) {
      var uri = this.getAttribute('resource') || this.getAttribute('about');
      var hash = "#/".concat(uri);

      if (event.altKey && event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        riot.route("".concat(hash, "//v-ui:ttl"));
      }
    }

    delegateHandler(document.body, 'click', '[resource], [about]', specialTemplateHandler, true); // Outline resource containers to switch view to special templates

    var outlined;
    /**
     * Unset title and remove outline from individual under mouse pointer
     * @param {Event} event
     */

    function removeOutline(event) {
      document.body.removeEventListener('mouseover', outline);

      if (outlined) {
        outlined.removeAttribute('title');
        outlined.classList.remove('gray-outline');
      }

      outlined = null;
    }
    /**
     * Set title = individual id and add outline for individual under mouse pointer
     * when Left mouse button with Ctrl + Alt keys are pressed
     * @param {Event} event
     * @this Element
     */


    function outline(event) {
      if (event.altKey && event.ctrlKey) {
        event.stopPropagation();

        if (outlined) {
          outlined.classList.remove('gray-outline');
          outlined.removeAttribute('title');
        }

        this.classList.add('gray-outline');
        this.setAttribute('title', this.getAttribute('resource') || this.getAttribute('about'));
        outlined = this;
      } else {
        removeOutline(event);
      }
    }

    document.body.addEventListener('keydown', function (event) {
      if (event.altKey && event.ctrlKey) {
        delegateHandler(document.body, 'mouseover', '[resource], [about]', outline);
      }
    });
    document.body.addEventListener('keyup', removeOutline);
    /**
     * Localize resources on the page on language change
     */

    veda.on('language:changed', function () {
      var resourcesNodes = document.querySelectorAll('[resource], [about]');
      var resources = Array.prototype.map.call(resourcesNodes, function (node) {
        return node.getAttribute('about') || node.getAttribute('resource');
      });
      resources = Util.unique(resources);
      resources.forEach(function (resource_uri) {
        var resource = new IndividualModel(resource_uri);

        for (var property_uri in resource.properties) {
          if (property_uri === '@') {
            continue;
          }

          if (resource.properties[property_uri] && resource.properties[property_uri].length && resource.properties[property_uri][0].type === 'String') {
            resource.trigger('propertyModified', property_uri, resource.get(property_uri));
            resource.trigger(property_uri, resource.get(property_uri));
          }
        }
      });
    });
    /**
     * Call router when anchor link is clicked
     * @param {Event} event
     * @this {Element}
     * @return {void}
     */

    function anchorHandler(event) {
      event.preventDefault();
      var hash = this.getAttribute('href');
      return hash === window.location.hash ? false : riot.route(hash);
    }

    delegateHandler(document.body, 'click', '[href^=\'#/\']', anchorHandler); // Prevent empty links routing

    delegateHandler(document.body, 'click', '[href=\'\']', function (event) {
      return event.preventDefault();
    }); // Router already installed flag

    var routerInstalled;
    /**
     * Install router
     * @param {Individual} main - Default individual to route if no hash is present
     * @return {void}
     */

    function installRouter(main) {
      if (routerInstalled) {
        return;
      }

      routerInstalled = true; // Router function

      riot.route(function (hash) {
        var loadIndicator = document.getElementById('load-indicator');
        loadIndicator.style.display = '';

        if (typeof hash === 'string') {
          var hash_index = hash.indexOf('#');

          if (hash_index >= 0) {
            hash = hash.substring(hash_index);
          } else {
            $('#main').empty();
            return main.present('#main').then(function () {
              return loadIndicator.style.display = 'none';
            });
          }
        } else {
          $('#main').empty();
          return main.present('#main').then(function () {
            return loadIndicator.style.display = 'none';
          });
        }

        var tokens = decodeURI(hash).slice(2).split('/');
        var uri = tokens[0];
        var container = tokens[1] || '#main';
        var template = tokens[2];
        var mode = tokens[3];
        var extra = tokens[4];

        if (extra) {
          extra = extra.split('&').reduce(function (acc, pair) {
            var split = pair.split('=');
            var name = split[0] || '';
            var values = split[1].split('|') || '';
            acc[name] = acc[name] || [];
            values.forEach(function (value) {
              return acc[name].push(parse(value));
            });
            return acc;
          }, {});
        }

        if (uri) {
          var individual = new IndividualModel(uri);
          $(container).empty();
          individual.present(container, template, mode, extra).then(function () {
            loadIndicator.style.display = 'none';

            if (!individual.scroll) {
              window.scrollTo(0, 0);
            }
          });
        } else {
          $('#main').empty();
          main.present('#main').then(function () {
            return loadIndicator.style.display = 'none';
          });
        }
      });
    }
    /**
     * Parse extra params in hash
     * @param {string} value
     * @return {Individual|Date|string|number|null}
     */


    function parse(value) {
      if (!Number.isNaN(value.split(' ').join('').split(',').join('.'))) {
        return parseFloat(value.split(' ').join('').split(',').join('.'));
      }

      if (!Number.isNaN(Date.parse(value))) {
        return new Date(value);
      }

      if (value === 'true') {
        return true;
      }

      if (value === 'false') {
        return false;
      }

      var individual = new IndividualModel(value);

      if (individual.isSync() && !individual.isNew()) {
        return individual;
      }

      return value || null;
    }

    var starting = false; // Triggered in auth

    veda.on('started', function () {
      if (starting === true) return;
      starting = true;
      var loadIndicator = document.getElementById('load-indicator');
      loadIndicator.style.display = '';
      var layout_uri = veda.manifest.veda_layout;
      var main_uri = veda.manifest.veda_main;
      var start_url = veda.manifest.start_url;
      $('#app').empty();

      if (layout_uri && main_uri && start_url) {
        var layout = new IndividualModel(layout_uri);
        layout.present('#app').then(function () {
          return new IndividualModel(main_uri).load();
        }).then(installRouter).catch(function (error) {
          var notify = new Notify();
          notify('danger', error);
        }).then(function () {
          return riot.route(window.location.hash || start_url);
        }).then(function () {
          return starting = false;
        });
      } else {
        console.log('Incomplete layout params in manifest');
        var layout_param_uri = veda.user.hasValue('v-s:origin', 'ExternalUser') ? 'cfg:LayoutExternal' : 'cfg:Layout';
        var layout_param = new IndividualModel(layout_param_uri);
        var main_param_uri = veda.user.hasValue('v-s:origin', 'ExternalUser') ? 'cfg:MainExternal' : 'cfg:Main';
        var main_param = new IndividualModel(main_param_uri);
        layout_param.load().then(function (layout_param) {
          return layout_param['rdf:value'][0].load();
        }).then(function (layout) {
          return layout.present('#app');
        }).then(function () {
          return main_param.load();
        }).then(function (main_param) {
          return main_param['rdf:value'][0].load();
        }).then(installRouter).catch(function (error) {
          var notify = new Notify();
          notify('danger', error);
        }).then(function () {
          return riot.route(window.location.hash);
        }).then(function () {
          return starting = false;
        });
      }
    });
  }

  _export("default", AppPresenter);

  return {
    setters: [function (_check_browserJs) {}, function (_commonVedaJs) {
      veda = _commonVedaJs.default;
    }, function (_commonLibRiotJs) {
      riot = _commonLibRiotJs.default;
    }, function (_commonIndividual_modelJs) {
      IndividualModel = _commonIndividual_modelJs.default;
    }, function (_notifyJs) {
      Notify = _notifyJs.default;
    }, function (_commonUtilJs) {
      Util = _commonUtilJs.default;
    }, function (_browserDom_helpersJs) {
      delegateHandler = _browserDom_helpersJs.delegateHandler;
    }, function (_browserNotification_listenerJs) {}, function (_browserLine_status_listenerJs) {}],
    execute: function () {}
  };
});
//# sourceMappingURL=app_presenter.js.map