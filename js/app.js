var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.bootstrap', 'googlechart'], function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
});

app.controller('MainCtrl', function ($scope, $http, $timeout, $uibModal, $log, uiGridConstants) {

  $scope.myData = [
    {
        "id": "1",
        "name": "Jane"
    },
    {
        "id": "2",
        "name": "John"
    },
    {
        "id": "3",
        "name": "Adam"
    },
    {
        "id": "4",
        "name": "Barry"
    },
    {
        "id": "5",
        "name": "Vincent"
    }
];

    $scope.votingResultObject = {};

    $scope.votingResultObject.type = "PieChart";

    $scope.votingResultObject.data = {"cols": [
        {id: "t", label: "Item", type: "string"},
        {id: "s", label: "votes", type: "number"}
    ], "rows": [
        {c: [
            {v: "Apple"},
            {v: 3},
        ]},
        {c: [
            {v: "Orange"},
            {v: 31}
        ]},
        {c: [
            {v: "Banana"},
            {v: 1},
        ]},
        {c: [
            {v: "Pineapple"},
            {v: 2},
        ]}
    ]};

    $scope.votingResultObject.options = {
        'title': 'Favorites'
    };

    console.log($scope.items);
    $scope.myAppScopeProvider = {
        showInfo : function(row) {
           var modalInstance = $uibModal.open({
                controller: 'InfoController',
                templateUrl: 'ngTemplate/infoPopup.html',
                resolve: {
                  selectedRow: function () {
                      return row.entity;
                  }
                }
           });
            modalInstance.result.then(function (selectedRow) {
                var len = $scope.items.length;
                $log.log('modal selected Row: ' + selectedRow.name);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };

$scope.userGridOptions = {
    enableSorting: false,
    columnDefs: [
      { field: 'name', displayName: "Name", width: '492' }
    ],
    enableRowSelection: true,
    appScopeProvider: $scope.myAppScopeProvider,
    rowTemplate: '<div style="cursor: pointer;" ng-click="grid.appScope.showInfo(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div>',
    data: $scope.myData
  };

  $http.get("http://localhost:8080/VotingAppService/getAllUsers")
    .then(function(response) {
        $scope.userGridOptions.data = response.data;
    });

});

app.controller('InfoController', function ($scope, $http, $uibModal, $uibModalInstance, $filter, selectedRow) {
    $scope.items = [
    {
        "id": "1",
        "name": "Apple"
    },
    {
        "id": "2",
        "name": "Orange"
    },
    {
        "id": "3",
        "name": "Banana"
    },
    {
        "id": "4",
        "name": "Pineapple"
    }
];

    $http.get("http://localhost:8080/VotingAppService/getVotingChoiceByUserId")
    .then(function(response) {
        $scope.items = response.data;
    });

    $scope.selectedRow = selectedRow;

    $scope.ok = function () {
        console.log(selectedRow);
        console.log($scope.fav);
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $scope.selectedRow = null;
        $uibModalInstance.dismiss('cancel');
    };
});
