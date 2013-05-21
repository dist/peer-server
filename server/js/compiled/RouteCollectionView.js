// Generated by CoffeeScript 1.6.1
(function() {
  ' \nDisplay and organization of the user-uploaded file collection. \nEdit/Done modes for saving.';
  var _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.RouteCollectionView = (function(_super) {

    __extends(RouteCollectionView, _super);

    function RouteCollectionView() {
      var _this = this;
      this.appendItemToRouteList = function(route, listEl) {
        return RouteCollectionView.prototype.appendItemToRouteList.apply(_this, arguments);
      };
      this.addOne = function(route) {
        return RouteCollectionView.prototype.addOne.apply(_this, arguments);
      };
      this.addAll = function() {
        return RouteCollectionView.prototype.addAll.apply(_this, arguments);
      };
      return RouteCollectionView.__super__.constructor.apply(this, arguments);
    }

    RouteCollectionView.prototype.el = "#router-view";

    RouteCollectionView.prototype.initialize = function(options) {
      $("#router-view").append("Routes:");
      this.tmplRouteListItem = Handlebars.compile($("#route-list-item-template").html());
      this.addAll();
      this.collection.bind("add", this.addOne);
      this.collection.bind("reset", this.addAll);
      this.collection.bind("change", this.handleFileChanged);
      return this.collection.add(new Route({
        routePath: "/sth",
        routeCode: "(function() {return 'sth'})()",
        isRequired: true
      }));
    };

    RouteCollectionView.prototype.addAll = function() {
      return this.collection.each(this.addOne);
    };

    RouteCollectionView.prototype.addOne = function(route) {
      var listEl;
      if (route.get("isProductionVersion")) {
        return;
      }
      listEl = this.tmplRouteListItem({
        cid: route.cid,
        routePath: route.get("routePath"),
        routeCode: route.get("routeCode")
      });
      return this.appendItemToRouteList(route, listEl);
    };

    RouteCollectionView.prototype.appendItemToRouteList = function(route, listEl) {
      $("#router-view").append(listEl);
      return null;
    };

    return RouteCollectionView;

  })(Backbone.View);

}).call(this);