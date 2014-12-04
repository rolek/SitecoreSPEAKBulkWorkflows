﻿define(["sitecore"], function (Sitecore) {
    var BulkWorkflow = Sitecore.Definitions.App.extend({

        filesUploaded: [],

        initialized: function () { },

        initialize: function () {
            $.ajax({
                url: "/api/sitecore/BulkWorkflow/GetAllWorkflows",
                type: "POST",
                context: this,
                success: function (data) {
                    var json = jQuery.parseJSON(data);

                    for (var i = 0; i < json.length; i++) {
                        var obj = json[i];
                        this.JsonDS.add(obj);
                    }
                }
            });
        },

        ApplyWorkflow: function () {
            this.pi.viewModel.show();

            var selectedWorkflow = this.workflow.viewModel.selectedValue();
            var selectedTemplates= this.tvTemplates.viewModel.checkedItemIds();

            $.ajax({
                url: "/api/sitecore/BulkWorkflow/ApplyWorkflow",
                type: "POST",
                data: { workflow: selectedWorkflow, "selectedTemplates": selectedTemplates},
                context: this,
                success: function (data) {
                    if (data == "True") {
                        this.miMessages.addMessage("notification", { text: "Workflow applied successfully for " + this.workflow.viewModel.selectedItem().DisplayName, actions: [], closable: true, temporary: true });
                    } else {
                        this.miMessages.addMessage("warning", "An error occured applying workflow for " + this.workflow.viewModel.selectedItem().DisplayName + " , please try again");
                    }
                    this.pi.viewModel.hide();
                }
            });
        },

    });

    return BulkWorkflow;
});