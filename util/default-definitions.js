"use strict";

module.exports = [
  {
    "chartType": "bar",
    "filterByArray": [
      "targetClose",
      "targetClose"
    ],
    "filterByValueArray": [
      ">= +0",
      "<= +30"
    ],
    "recordType": "OpportunityListItem",
    "groupBy": "opportunityStage",
    "totalBy": "amount",
    "description": "Opportunities next 30 days"
  },
  {
    "chartType": "donut",
    "filterByArray": [
      "status"
    ],
    "filterByValueArray": [
      "A"
    ],
    "recordType": "Incident",
    "groupBy": "assignedTo",
    "totalBy": "_count",
    "description": "Assigned incidents by assignee"
  },
  {
    "chartType": "pie",
    "filterByArray": [
      "orderDate",
      "orderDate"
    ],
    "filterByValueArray": [
      ">= +0",
      "<= +7"
    ],
    "recordType": "SalesOrderListItem",
    "groupBy": "customer",
    "totalBy": "total",
    "description": "Next week's sales orders"
  },
  {
    "chartType": "bar",
    "filterByArray": [
      "orderDate",
      "status"
    ],
    "filterByValueArray": [
      "> +0",
      "O"
    ],
    "recordType": "SalesOrderListItem",
    "groupBy": "salesRep",
    "totalBy": "_count",
    "description": "Past due sales orders by rep"
  }
];
