import { Component, Input, Output, EventEmitter,
    AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '../../../translate/translate.service';
import { Http } from '@angular/http';
import { NetworkPackage } from '../../../classes/network.class';
import swal from 'sweetalert2/dist/sweetalert2.js'
declare var $: any;


@Component({
  selector: 'popup-migrate',
  templateUrl: './popupmigrate.view.html',
  styleUrls: ['./popupmigrate.style.scss']
})


export class PopupMigrate implements AfterViewInit {
    @Output() onMigrate: EventEmitter<any> = new EventEmitter<any>();
    @Input() category: string = "";
    @Input() modalId: string = "myModal";
    @Input() readOnly: boolean = false;
    @Input() instance: any = {};
    public itemName = "";
    public np: NetworkPackage = null;
    public formElements: any = [];
    public currentCat: string = "inventory";
    public date: Date = new Date();
    public settings = null;


    public constructor(private _translate: TranslateService,
                private http: Http, private cdRef:ChangeDetectorRef) {
         this.np = new NetworkPackage(http);
         this.settings = {
            bigBanner: true,
            timePicker: true,
            format: this._translate.instant("datetimeformat_pipe"),
            defaultOpen: false
        };
    };


    // Init here!
    public ngOnChanges() {
        this.cdRef.detectChanges();
        if (!this.instance.workflow) {
            this.instance.workflow = {};
        }
        this.initWorkflow(this.formElements);
        this.detectCurrentStatus();
        this.formElements = [];
        this.itemName = this.instance.name || this.instance.servicename;
    };


    public changeCat(cat) {
        this.currentCat = cat;
    };


    public ngAfterViewInit() {
        this.getFormElements();
        
        // Resetting so we can reload data/nested component.
        if (this.category !== "") {
            var tmp = this.category.substr(0, this.category.length);
            this.category = "";
            this.category = tmp;
        }
        $('#' + this.modalId).modal('show');
    };


    /**
     *  Getting this from inventory form.
     *  @param $event contains current attributes 
     *         which has been entered to the UI.
     *         We need to remove server_name since we don't need it here.
     */
    public inventoryDataChanged($event) {
        $event.server_name = undefined;
        this.instance.workflow.attributes = $event;
    };


    public detectCurrentStatus() {
        this.currentCat = "inventory";

        if (this.instance.planned) {
            this.currentCat = "planning";
        }
        if (this.readOnly || this.instance.status === "done") {
            this.currentCat = "migration";
        }
    };


    /**
     *  Notify parent component that an action has been taken.
     */
    public migrate() {
        this.onMigrate.emit(this.instance.workflow);
    };


    public contentChanged(code, field, $event) {
        this.instance.workflow[code][field] = $event;
    };


    /**
     *  Loading workflow elements (questions) from backend.
     *  We use these elements to build the form.
     */
    public getFormElements() {
        if (this.category === "") {
            this.np.workflowGet(function(response) {
                this.handleFormResponse(response);
            }.bind(this));
        } else {
            this.np.workflowCategoryGet(this.category, function(response) {
                this.handleFormResponse(response);
            }.bind(this));
        }
    };


    /**
     *  Setting next status of workflow element.
     *  @param code: e.g. server/application
     *  @param status: true, false or undefined(unset).
     */
    public setCheck(code, status) {
        if (this.instance.workflow[code].checked === status) {
            this.instance.workflow[code].checked = undefined;
            return;
        }
        this.instance.workflow[code].checked = status;
    };


    /**
     *  Helper method to avoid duplicates.
     *  @param raw response from backend.
     */
    private handleFormResponse(response) {
        if (!response || !response._body) {
            return;
        }
        try {
            var json = JSON.parse(response._body);
            this.initWorkflow(json);
            this.formElements = json;
        } catch (ex) {
            console.log("Popupmigrate: " + ex);
        }
    };


    /**
     *  If there are any new/undefined fields, we'll add them here
     *  to avoid any errors on the view.
     *  @param form_elements from backend.
     */
    private initWorkflow(form_elements) {
        if (this.instance.attributes === undefined) {
            this.instance.attributes = {};
        }

        for (var i = 0; i < form_elements.length; i++) {
            if (!this.instance.workflow[form_elements[i].code]) {
                this.instance.workflow[form_elements[i].code] = {};
            }

            if (form_elements[i].attribute !== undefined) {
                if (this.instance.attributes[form_elements[i].attribute] === undefined) {
                    this.instance.attributes[form_elements[i].attribute] = "";
                }

            }
        }
    };
};