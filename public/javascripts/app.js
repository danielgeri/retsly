(function() {
	var app = angular.module('retslyApp',[]);

	app.controller('retslyController',[
		'$scope',
		'$http',
		'$location', 
		'$animate',
		'$window',
		function($scope,$http,$location,$animate,$window) {
		
		var vm = this;
		var id = 'o9gYmb2fJ5OgyCPRcVJJ';
		var secret = '01wktnxCnFt1zNxcuqxaeOhLvn6ZaKf1QTcLm6NW';
		var access_token = '886502f6937e0c9db3349beb08f110e3';
		vm.test = 'test';
		vm.listings = '';
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
			var param = vm.getParam();
			url += '&zipCode=' + param;
			url += '&limit=100';
			url += '&status=Active';
			$http.get(url
			).success(function(data) {
				console.log(data);
				vm.listings = data.bundle;
				vm.plotListingsOnMap(map,vm.listings);
			}).error(function(error){
				vm.alertMessage = 'There was an error retreiving data from retsly:' + error
				$scope.$apply();
			});
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

		vm.getParam = function() {
			var paramValue = '';
			var locationURL = $location.$$absUrl;
			console.log(locationURL);
			if(locationURL.indexOf('location') > -1){    
        paramValue= locationURL.split('=')[1];
	    }
	    return paramValue;
		}

		vm.readableDate = function(dateString) {
			var d = new Date(dateString);
			return (d.getMonth() + 1) + '/' d.getDate() + '/' + d.getFullYear();
		}

		vm.initMap = function() {
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 37.7833, lng: -122.4167},
				zoom: 8
			});
		}

	}]);

})();