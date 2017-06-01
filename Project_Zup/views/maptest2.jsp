<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
</head>
<body>

<div id="map" style="width:100%;height:500px"></div>

<script>

var lat = {};
var longi = {};

function myMap() {
  
  getLocation();
  
  //사용자의 위치 따오기
  function getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
      } else {
          alert("지도의 위치를 가져올수 없습니다...");
      }
  }

  //사용자위치 따오기 콜백 메소드
  function showPosition(position) {
    
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
    
      lat.x = position.coords.latitude;
      longi.y = position.coords.longitude;    
      
      console.log(lat.x);
      console.log(longi.y);
      showMap();
  }
  
  function showMap(){
	  
	//구글맵 생성
	  //37.4785648, 126.88076539999999
	    var mapCanvas = document.getElementById("map");
	    var myCenter = new google.maps.LatLng(lat.x, longi.y);
	//  var myCenter = new google.maps.LatLng(37.4785648, 126.88076539999999);
	    var mapOptions = {
	      center: myCenter,
	      zoom: 17,
	      panControl: true,
	      zoomControl: true,
	      mapTypeControl: true,
	      scaleControl: true,
	      streetViewControl: true,
	      overviewMapControl: true,
	      rotateControl: true   
	    };
	    
	    var map = new google.maps.Map(mapCanvas, mapOptions);
	    var marker = new google.maps.Marker({position:myCenter});
	    
	    //지도에 마커를 지울려면 null 값을 전달하여야 한다.
	    marker.setMap(map);

	    var infowindow = new google.maps.InfoWindow({
	      content: "<p>서울특별시 거시기 뭐시기 ㅎㅎㅎㅎ</p>"
	    });
	    infowindow.open(map,marker);
  }
  
}
    
</script>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRLghKISjTtl9u_aDoa4e2C1H0D7us9hI&callback=myMap"></script>
<!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRLghKISjTtl9u_aDoa4e2C1H0D7us9hI"></script> -->

</body>
</html>