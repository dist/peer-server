// Generated by CoffeeScript 1.6.2
(function() {
  'Display and organization of the user-uploaded file collection.\nEdit/Done modes for saving.';
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ServerFileCollectionView = (function(_super) {
    __extends(ServerFileCollectionView, _super);

    function ServerFileCollectionView() {
      this.selectFile = __bind(this.selectFile, this);
      this.appendItemToFileList = __bind(this.appendItemToFileList, this);
      this.editableFileName = __bind(this.editableFileName, this);
      this.eventKeypressWhileRenaming = __bind(this.eventKeypressWhileRenaming, this);
      this.eventDoneNamingFile = __bind(this.eventDoneNamingFile, this);
      this.createFile = __bind(this.createFile, this);
      this.eventCreateCSS = __bind(this.eventCreateCSS, this);
      this.eventCreateDynamic = __bind(this.eventCreateDynamic, this);
      this.eventCreateJS = __bind(this.eventCreateJS, this);
      this.eventCreateHTML = __bind(this.eventCreateHTML, this);
      this.handleFileDeleted = __bind(this.handleFileDeleted, this);
      this.handleFileChanged = __bind(this.handleFileChanged, this);
      this.handleFile = __bind(this.handleFile, this);
      this.eventDropFiles = __bind(this.eventDropFiles, this);
      this.eventUploadFiles = __bind(this.eventUploadFiles, this);
      this.preventDefault = __bind(this.preventDefault, this);
      this.eventSaveChanges = __bind(this.eventSaveChanges, this);
      this.eventDeleteFileConfirmed = __bind(this.eventDeleteFileConfirmed, this);
      this.eventDeleteFile = __bind(this.eventDeleteFile, this);
      this.eventRenameFile = __bind(this.eventRenameFile, this);
      this.eventSelectFile = __bind(this.eventSelectFile, this);
      this.addOne = __bind(this.addOne, this);
      this.addAll = __bind(this.addAll, this);      _ref = ServerFileCollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ServerFileCollectionView.prototype.el = "#file-collection-view";

    ServerFileCollectionView.prototype.initialize = function(options) {
      this.activeServerFileView = null;
      this.fileViewContainer = this.$("#file-view-container");
      this.uploadFilesRegion = this.$(".file-drop");
      this.fileLists = this.$(".file-list");
      this.saveChangesButton = this.$(".save-changes");
      this.tmplFileListItem = Handlebars.compile($("#file-list-item-template").html());
      this.tmplEditableFileListItem = Handlebars.compile($("#editable-file-list-item-template").html());
      this.addAll();
      this.collection.bind("add", this.addOne);
      this.collection.bind("reset", this.addAll);
      this.collection.bind("change", this.handleFileChanged);
      return this.collection.bind("destroy", this.handleFileDeleted);
    };

    ServerFileCollectionView.prototype.events = {
      "dragover .file-drop": "preventDefault",
      "drop .file-drop": "eventDropFiles",
      "click .file-list li[data-cid] input": "preventDefault",
      "blur .file-list li[data-cid] input": "eventDoneNamingFile",
      "keypress .file-list li[data-cid] input": "eventKeypressWhileRenaming",
      "click .file-list li[data-cid]": "eventSelectFile",
      "click .file-list li[data-cid] .dropdown-menu .rename": "eventRenameFile",
      "click .file-list li[data-cid] .dropdown-menu .delete": "eventDeleteFile",
      "click .file-list .file-delete-confirmation .deletion-confirmed": "eventDeleteFileConfirmed",
      "click .save-changes": "eventSaveChanges",
      "click .upload-files": "eventUploadFiles",
      "click .create-menu .html": "eventCreateHTML",
      "click .create-menu .js": "eventCreateJS",
      "click .create-menu .css": "eventCreateCSS",
      "click .create-menu .dynamic": "eventCreateDynamic"
    };

    ServerFileCollectionView.prototype.addAll = function() {
      return this.collection.each(this.addOne);
    };

    ServerFileCollectionView.prototype.addOne = function(serverFile) {
      var listEl;

      if (serverFile.get("isProductionVersion")) {
        return;
      }
      listEl = this.tmplFileListItem({
        cid: serverFile.cid,
        name: serverFile.get("name"),
        isRequired: serverFile.get("isRequired")
      });
      return this.appendItemToFileList(serverFile, listEl);
    };

    ServerFileCollectionView.prototype.eventSelectFile = function(event) {
      var cid, serverFile, target;

      target = $(event.currentTarget);
      cid = target.attr("data-cid");
      serverFile = this.collection.get(cid);
      if (this.activeServerFileView && this.activeServerFileView.model === serverFile) {
        target.find(".dropdown-menu").removeAttr("style");
        target.addClass("open");
      } else {
        this.fileLists.find(".dropdown-menu").hide();
        this.fileLists.find(".caret").hide();
        this.uploadFilesRegion.hide();
        this.fileViewContainer.show();
        this.selectFile(serverFile, target);
      }
      return false;
    };

    ServerFileCollectionView.prototype.eventRenameFile = function(event) {
      var serverFile, target;

      target = $(event.currentTarget).parents("li[data-cid]");
      serverFile = this.collection.get(target.attr("data-cid"));
      return this.editableFileName(serverFile, target);
    };

    ServerFileCollectionView.prototype.eventDeleteFile = function(event) {
      var serverFile, target;

      target = $(event.currentTarget).parents("li[data-cid]");
      serverFile = this.collection.get(target.attr("data-cid"));
      return this.$(".file-delete-confirmation[data-cid=" + serverFile.cid + "]").modal("show");
    };

    ServerFileCollectionView.prototype.eventDeleteFileConfirmed = function(event) {
      var serverFile, target;

      target = $(event.currentTarget).parents(".file-delete-confirmation[data-cid]");
      serverFile = this.collection.get(target.attr("data-cid"));
      this.$(".file-delete-confirmation[data-cid=" + serverFile.cid + "]").modal("hide");
      return serverFile.destroy();
    };

    ServerFileCollectionView.prototype.eventSaveChanges = function() {
      this.collection.createProductionVersion();
      this.saveChangesButton.addClass("disabled");
      return this.saveChangesButton.find("a").text("Changes Saved");
    };

    ServerFileCollectionView.prototype.preventDefault = function(event) {
      event.preventDefault();
      return false;
    };

    ServerFileCollectionView.prototype.eventUploadFiles = function() {
      if (this.activeServerFileView) {
        this.activeServerFileView.remove();
      }
      this.activeServerFileView = null;
      this.fileLists.find(".dropdown-menu").hide();
      this.fileLists.find(".caret").hide();
      this.$(".file-list li").removeClass("active");
      this.fileViewContainer.hide();
      return this.uploadFilesRegion.show();
    };

    ServerFileCollectionView.prototype.eventDropFiles = function(event) {
      var droppedFiles, file, _i, _len;

      event.preventDefault();
      droppedFiles = event.originalEvent.dataTransfer.files;
      for (_i = 0, _len = droppedFiles.length; _i < _len; _i++) {
        file = droppedFiles[_i];
        this.handleFile(file);
      }
      return false;
    };

    ServerFileCollectionView.prototype.handleFile = function(file) {
      var fileType, reader,
        _this = this;

      reader = new FileReader();
      fileType = ServerFile.rawTypeToFileType(file.type);
      if (fileType === ServerFile.fileTypeEnum.IMG) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
      return reader.onload = function(evt) {
        var contents, serverFile;

        contents = evt.target.result;
        serverFile = new ServerFile({
          name: file.name,
          size: file.size,
          type: file.type,
          contents: contents
        });
        _this.collection.add(serverFile);
        return serverFile.save();
      };
    };

    ServerFileCollectionView.prototype.handleFileChanged = function() {
      this.saveChangesButton.removeClass("disabled");
      return this.saveChangesButton.find("a").text("Save Changes");
    };

    ServerFileCollectionView.prototype.handleFileDeleted = function(deletedServerFile) {
      return this.$("[data-cid=" + deletedServerFile.cid + "]").remove();
    };

    ServerFileCollectionView.prototype.eventCreateHTML = function() {
      var serverFile;

      serverFile = new ServerFile({
        type: "text/html"
      });
      return this.createFile(serverFile);
    };

    ServerFileCollectionView.prototype.eventCreateJS = function() {
      var serverFile;

      serverFile = new ServerFile({
        type: "application/x-javascript"
      });
      return this.createFile(serverFile);
    };

    ServerFileCollectionView.prototype.eventCreateDynamic = function() {
      var serverFile;

      serverFile = new ServerFile({
        type: "application/dynamic"
      });
      return this.createFile(serverFile);
    };

    ServerFileCollectionView.prototype.eventCreateCSS = function() {
      var serverFile;

      serverFile = new ServerFile({
        type: "text/css"
      });
      return this.createFile(serverFile);
    };

    ServerFileCollectionView.prototype.createFile = function(serverFile) {
      this.collection.add(serverFile, {
        silent: true
      });
      return this.editableFileName(serverFile, null);
    };

    ServerFileCollectionView.prototype.eventDoneNamingFile = function(event) {
      var listEl, newListEl, serverFile, target;

      target = $(event.currentTarget);
      listEl = target.parents("li[data-cid]");
      serverFile = this.collection.get(listEl.attr("data-cid"));
      serverFile.save({
        name: target.val()
      });
      newListEl = this.tmplFileListItem({
        cid: serverFile.cid,
        name: serverFile.get("name"),
        isRequired: serverFile.get("isRequired")
      });
      newListEl = $($.parseHTML(newListEl));
      listEl.replaceWith(newListEl);
      return this.selectFile(serverFile, newListEl);
    };

    ServerFileCollectionView.prototype.eventKeypressWhileRenaming = function(event) {
      if (event.keyCode === 13) {
        return this.eventDoneNamingFile(event);
      }
    };

    ServerFileCollectionView.prototype.editableFileName = function(serverFile, listElToReplace) {
      var listEl;

      listEl = this.tmplEditableFileListItem({
        cid: serverFile.cid,
        name: serverFile.get("name")
      });
      if (listElToReplace) {
        listEl = $($.parseHTML(listEl));
        listElToReplace.replaceWith(listEl);
      } else {
        listEl = this.appendItemToFileList(serverFile, listEl);
      }
      return listEl.find("input").focus();
    };

    ServerFileCollectionView.prototype.appendItemToFileList = function(serverFile, listEl) {
      var section;

      section = null;
      if (serverFile.get("isRequired")) {
        section = this.$(".file-list.required");
      } else {
        switch (serverFile.get("fileType")) {
          case ServerFile.fileTypeEnum.HTML:
            section = this.$(".file-list.html");
            break;
          case ServerFile.fileTypeEnum.CSS:
            section = this.$(".file-list.css");
            break;
          case ServerFile.fileTypeEnum.JS:
            section = this.$(".file-list.js");
            break;
          case ServerFile.fileTypeEnum.IMG:
            section = this.$(".file-list.img");
            break;
          case ServerFile.fileTypeEnum.DYNAMIC:
            section = this.$(".file-list.dynamic");
        }
      }
      if (section) {
        return section.append(listEl);
      }
      return null;
    };

    ServerFileCollectionView.prototype.selectFile = function(serverFile, listEl) {
      var caret, serverFileView;

      this.$(".file-list li").removeClass("active");
      listEl.addClass("active");
      caret = listEl.find(".caret");
      caret.show();
      if (this.activeServerFileView) {
        this.activeServerFileView.remove();
      }
      serverFileView = new ServerFileView({
        model: serverFile
      });
      this.fileViewContainer.append(serverFileView.render().el);
      this.activeServerFileView = serverFileView;
      return this.fileViewContainer.height($(window).height() - this.fileViewContainer.offset().top);
    };

    return ServerFileCollectionView;

  })(Backbone.View);

}).call(this);

/*
//@ sourceMappingURL=ServerFileCollectionView.map
*/
