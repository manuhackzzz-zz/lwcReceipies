import { LightningElement, api, track } from "lwc";
import getRelatedProps from "@salesforce/apex/hcgov_PropertiesTableController.getRelatedProps";
import {
  publish,
  createMessageContext,
  releaseMessageContext,
  subscribe,
  APPLICATION_SCOPE,
  unsubscribe
} from "lightning/messageService";
import lmsDemoMC from "@salesforce/messageChannel/LMSDemoWin__c";

export default class Hcgov_PropertiesTable extends LightningElement {
  @api recordId;
  @track showSpinner = true;
  @track sortedBy;
  @track sortDirection;
  @track isDescending = false;
  @track error;
  @track properties;
  @track receivedMessage = "";
  @track columns = [
    {
      label: "Agency",
      fieldName: "Agency",
      type: "text",
      cellAttributes: { alignment: "left", class: { fieldName: "myRowClass" } },
      sortable: true
    },
    {
      label: "Location",
      fieldName: "propURL",
      type: "url",
      cellAttributes: { alignment: "left", class: { fieldName: "myRowClass" } },
      sortable: true,
      initialWidth: 150,
      typeAttributes: {
        label: { fieldName: "Location" },
        target: "_blank"
      }
    },
    {
      label: "MSA #",
      fieldName: "MSA",
      type: "number",
      cellAttributes: {
        alignment: "right",
        class: { fieldName: "myRowClass" }
      },
      typeAttributes: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
      sortable: true
    },
    {
      label: "Value",
      fieldName: "Value",
      type: "currency",
      cellAttributes: {
        alignment: "right",
        class: { fieldName: "myRowClass" }
      },
      typeAttributes: { currencyCode: "USD", minimumFractionDigits: 0 },
      sortable: true
    },
    {
      label: "NOI",
      fieldName: "NOI",
      type: "currency",
      cellAttributes: {
        alignment: "right",
        class: { fieldName: "myRowClass" }
      },
      typeAttributes: { currencyCode: "USD", minimumFractionDigits: 0 },
      sortable: true
    },
    {
      label: "Cap Rate",
      fieldName: "Cap_Rate",
      type: "number",
      cellAttributes: {
        class: { fieldName: "myRowClass" }
      },
      typeAttributes: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
      sortable: true
    },
    {
      label: "RSF",
      fieldName: "RSF",
      type: "number",
      cellAttributes: {
        class: { fieldName: "myRowClass" }
      },
      sortable: true
    },
    {
      label: "Firm",
      fieldName: "Firm",
      type: "number",
      cellAttributes: {
        class: { fieldName: "myRowClass" }
      },
      typeAttributes: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
      sortable: true
    },
    {
      label: "Total",
      fieldName: "Total",
      type: "number",
      cellAttributes: {
        class: { fieldName: "myRowClass" }
      },
      typeAttributes: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
      sortable: true
    },
    {
      label: "Age",
      fieldName: "Age",
      type: "number",
      cellAttributes: {
        class: { fieldName: "myRowClass" }
      },
      typeAttributes: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
      sortable: true
    }
  ];

  context = createMessageContext();

  constructor() {
    super();
    const parentPage = this;
    this.channel = subscribe(
      this.context,
      lmsDemoMC,
      function(event) {
        if (event != null) {
          const message = event.portfolioId;
          if (message != null) {
            //this.searchKey = message;
          }
          const source = event.source;
          parentPage.receivedMessage =
            "Message: " + message + ". Sent From: " + source;
          getRelatedProps({ recordId: message })
            .then(result => {
              console.log(result[0]);
              parentPage.properties = result;
              parentPage.showSpinner = false;
            })
            .catch(error => {
              console.log(error);
              parentPage.error = error;
            });
        }
      },
      { scope: APPLICATION_SCOPE }
    );
    console.log("resultadasdasdsa[0]");
  }

  connectedCallback() {
    let toSearchId;
    console.log("RecordId --- >>" + this.recordId);
    if (this.recordId != null) {
      toSearchId = this.recordId;
    }
    getRelatedProps({ recordId: toSearchId })
      .then(result => {
        console.log(result[0]);
        this.properties = result;
        this.showSpinner = false;
      })
      .catch(error => {
        console.log(error);
        this.error = error;
      });
  }

  updateColumnSorting(event) {
    let fieldName = event.detail.fieldName;
    let sortDirection = event.detail.sortDirection;
    if (fieldName === "propURL") {
      fieldName = "Location";
      this.sortDirection = sortDirection;
      this.sortedBy = "propURL";
      this.sortData(fieldName, sortDirection);
    } else {
      this.sortDirection = sortDirection;
      this.sortedBy = fieldName;
      this.sortData(fieldName, sortDirection);
    }
  }

  sortData(fieldName, sortDirection) {
    console.log("fieldName >>>" + fieldName);
    console.log("sortDirection >>>" + sortDirection);
    let sortResult = [...this.properties];
    let firstRow = sortResult.splice(0, 1);
    let remainingSorted = sortResult.sort(function(a, b) {
      let x = a[fieldName];
      if (a[fieldName] < b[fieldName]) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (a[fieldName] > b[fieldName]) {
        return sortDirection === "asc" ? 1 : -1;
      } else return 0;
    });
    this.properties = firstRow.concat(remainingSorted);
  }
}