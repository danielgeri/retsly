(function() {
	var app = angular.module('retslyApp',[]);

	app.controller('retslyController',[
		'$scope',
		'$http',
		'$location', 
		'$animate',
		'$window',
		'$timeout',
		function($scope,$http,$location,$animate,$window,$timeout) {
		
		var vm = this;
		var id = 'o9gYmb2fJ5OgyCPRcVJJ';
		var secret = '01wktnxCnFt1zNxcuqxaeOhLvn6ZaKf1QTcLm6NW';
		var access_token = '886502f6937e0c9db3349beb08f110e3';
		vm.test = 'test';
		vm.listings = '';
		vm.predicate = '-ROI';
		vm.propertyListing = '';
		vm.propertyROI = '';
		vm.alteredPrice = '';
		//individual listing data

		// $locationProvider.html5mode(true);

		vm.getListings = function() {
			var mapdiv = document.getElementById("map");
			var listingsul = document.getElementById("listings");
			mapdiv.style.height = ($window.innerHeight - 50) + 'px';
			listingsul.style.height = ($window.innerHeight - 160) + 'px';
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 37.7833, lng: -122.4167},
				zoom: 12
			});
			var mapdiv = document.getElementById("map");
			mapdiv.style.width = $window.innerHeight;
			//pull in homes only status active
			var url = 'https://rets.io/api/v1/test_sf/listings?access_token=886502f6937e0c9db3349beb08f110e3';
			var param = vm.getParamValue('location');
			url += '&zipCode=' + param;
			url += '&limit=50';
			url += '&status=Active';
			$http.get(url
			).success(function(data) {
				$timeout(function() {
		      vm.listings = vm.addROIField(data.bundle);
					vm.plotListingsOnMap(map,vm.listings);
		    }, 0);
				
			}).error(function(error){
				vm.alertMessage = 'There was an error retreiving data from retsly:' + error
				$scope.$apply();
			});
		}

		vm.order = function(predicate) {
      vm.predicate = predicate;
    };

    vm.getOneListing = function(listingId) {
			var listingURL = 'https://rets.io/api/v1/test_sf/listings/' + listingId + '?access_token=886502f6937e0c9db3349beb08f110e3';
			$http.get(listingURL
			).success(function(data) {
				$timeout(function() {
		      console.log(data);
		    }, 0);
				// vm.listings = vm.addROIField(data.bundle);
			}).error(function(error){
				vm.alertMessage = 'There was an error retreiving data from retsly:' + error
				$scope.$apply();
			});
		}

		vm.addROIField = function(listings) {
			for (var i = listings.length - 1; i >= 0; i--) {
				listings[i].ROI = 'ROIBABY!';
				listings[i].estimatedRent = 4000;
			};
			return listings;
		}

		vm.plotListingsOnMap = function(map,listings) {

			for (var i = listings.length - 1; i >= 0; i--) {
				var myLatLng = {
					lat: parseFloat(listings[i].coordinates[1]),
					lng: parseFloat(listings[i].coordinates[0])
				};
				var marker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					title:"Hello World!"
				});
				marker.setMap(map);
			};

		}

		vm.getParamValue = function(variable) {
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				if (pair[0] == variable) {
					return pair[1];
				}
			}
		}

		vm.readableDate = function(dateString) {
			var d = new Date(dateString);
			var dM = d.getMonth() + 1;
			var date = dM + '/' + d.getDate() + '/' + d.getFullYear();
			return date;
		}

		vm.daysFromListing = function(dateString) {
			var d = new Date(dateString);
			var today = new Date();
			var days = (((((today - d) / 1000) / 60) / 60) / 24);
			return Math.round(days)
		}

		vm.initMap = function() {
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 37.7833, lng: -122.4167},
				zoom: 8
			});
		}

		vm.calculateROI = function(listing, tax, listingPrice, capEx, rent) {
			// var rent = vm.calculateRent(city, state, address);
			var NOI = (rent * 12) + tax;
			var homeCost = listingPrice + capEx;
			var returnOnI = NOI / homeCost;
			if(listing != null) {
				listing.ROI = (Math.ceil(returnOnI * 100) / 100);
			}
			return (Math.ceil(returnOnI * 100) / 100);
		}

		vm.calculateCapEx = function(yearBuilt,sqFt) {
			var capEx = ((-.25 * yearBuilt) + 500) * sqFt;
			return capEx;
		}

		vm.calculateRent = function(listing, city, state, address) {
			var zillowAPIURL = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1a08n4bl7nv_anh8k&citystatezip=' + city + ',' + state + '&address=' + address;
			console.log(zillowAPIURL);
			$http.get(zillowAPIURL
			).success(function(data) {
				$timeout(function() {
		      console.log(data);
		    }, 0);
			}).error(function(error){
				vm.alertMessage = 'There was an error retreiving data from zillow:' + error
			});
		}

		vm.alertMessage = function(listingIdd) {
			var listingUrl = 'https://rets.io/api/v1/test_sf/listings/'+listingIdd+'?access_token=a7a8875b6cfaabeb96bfeea160f083ff'
			$http({
				method: 'GET',
				url: listingUrl
			}).then(function successCallback(response) {
				vm.propertyListing = response.data.bundle;
				console.log(vm.propertyListing.squareFootage);
				vm.propertyListing.estimatedRent = 4000;
				vm.propertyListing.capEx = vm.calculateCapEx(vm.propertyListing.yearBuilt,vm.propertyListing.squareFootage)
				vm.propertyListing.ROI = vm.calculateROI(
					null,
					vm.propertyListing.taxAnnual,
					vm.propertyListing.price,
					vm.propertyListing.capEx,
					vm.propertyListing.estimatedRent
				);
				vm.alteredPrice = vm.propertyListing.price;
				vm.alteredCapEx = vm.propertyListing.capEx;
				$('#myModal').foundation('reveal', 'open');
				$timeout(function() {
		      $(document).foundation('orbit', 'reflow');
		    }, 1000);
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}

		vm.recalculateROI = function() {
			vm.propertyListing.ROI = vm.calculateROI(
				null,
				vm.propertyListing.taxAnnual,
				parseFloat(vm.alteredPrice),
				parseFloat(vm.alteredCapEx),
				vm.propertyListing.estimatedRent
			);
		}

		vm.callAgent = function () {
			var agentURL = '/call';
			$http({
				method: 'GET',
				url: agentURL
			});
			$('.agent-button').addClass('disabled');
		}

	}]);

})();