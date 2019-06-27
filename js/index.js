var map;
var lat;
var lon;
var libName;
var libNum;

var imageSrc = "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
var imageSize = new daum.maps.Size(24, 35); 
var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize); 

window.onload = function(){
	makeMap();
    handleMarker();
}

function makeMap(){
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new daum.maps.LatLng(37.661219,127.060182), // 중심좌표
        level: 3 // 지도의 확대 레벨
    };

	map = new daum.maps.Map(mapContainer, mapOption); 
	
	// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
	var mapTypeControl = new daum.maps.MapTypeControl();

	// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
	// daum.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
	map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

	// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
	var zoomControl = new daum.maps.ZoomControl();
	map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

}

function handleMarker() {
	for(var i = 1; i <= 166; i++){
		var url = "http://openapi.seoul.go.kr:8088/415068537968736737317647475547/xml/SeoulPublicLibraryInfo/" + i + "/" + i;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				LibraryMarker(this);
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}
}

function handleList(){
	var url = "http://openapi.seoul.go.kr:8088/415068537968736737317647475547/xml/SeoulPublicLibraryInfo/1/166";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			listLibrary(this);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function handleSearch() {
	var url = "http://openapi.seoul.go.kr:8088/415068537968736737317647475547/xml/SeoulPublicLibraryInfo/1/166";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			searchLibrary(this);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function handleDetails(libNum) {
	var url = "http://openapi.seoul.go.kr:8088/415068537968736737317647475547/xml/SeoulPublicLibraryInfo/1/166";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			detailsLibrary(this, libNum);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function handleBook(libName){
	for(var i = 1; i <= 1605; i++){
		var url = "http://openapi.seoul.go.kr:8088/415068537968736737317647475547/xml/SeoulLibRecommendInfo/" + i + "/" + i;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				bookList(this,libName);
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}
}

function LibraryMarker(xml) {
    var xmlDoc = xml.responseXML;
    	library = xmlDoc.getElementsByTagName("row");
    var row = library[0];

    lat = row.getElementsByTagName("XCNTS")[0].childNodes[0].nodeValue;
    lon = row.getElementsByTagName("YDNTS")[0].childNodes[0].nodeValue;
    libName = row.getElementsByTagName("LBRRY_NAME")[0].childNodes[0].nodeValue;
    libNum = row.getElementsByTagName("LBRRY_SEQ_NO")[0].childNodes[0].nodeValue;
    
    var markerPosition  = new daum.maps.LatLng(lat, lon); 
    
    var marker = new daum.maps.Marker({
    	map:map,
    	position: markerPosition,
    	image : markerImage
    });

    var iwContent = '<div class="info">' + libName + 
    '<br><a onclick="handleDetails(' + libNum + ')">자세히 보기</a>' +
    '</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

    iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

	// 인포윈도우를 생성합니다
	var infowindow = new daum.maps.InfoWindow({
	    content : iwContent,
	    removable : iwRemoveable
	});
	
	// 마커에 클릭이벤트를 등록합니다
	daum.maps.event.addListener(marker, 'click', function() {
	      // 마커 위에 인포윈도우를 표시합니다
	      infowindow.open(map, marker);  
	});
 }

function searchLibrary(xml){
	var searchTxt = document.getElementById("searchTxt").value; //검색한 내용을 가져옴
	var searchTypeChoose = document.getElementById("searchType").value; //무엇을 검색하려는 지 가져옴(이름,주소)
	
	if(searchTxt != ""){
		if(searchTypeChoose == 'name') var searchType = "LBRRY_NAME";
		else var searchType = "ADRES";
		//이름으로 검색하는 지, 주소로 검색하는 지 판단함
	
	    var xmlDoc = xml.responseXML;
	    	library = xmlDoc.getElementsByTagName("row");
	    
	    for (var i = 0; i < library.length; i++) {
	        var row = library[i];
	        
	        var searchTxtCompare = row.getElementsByTagName(searchType)[0].childNodes[0].nodeValue;
	    	
	        if(searchTxt == searchTxtCompare){
	            lat = row.getElementsByTagName("XCNTS")[0].childNodes[0].nodeValue; 
	            lon = row.getElementsByTagName("YDNTS")[0].childNodes[0].nodeValue;
	            //경도와 위도를 받아옴
	            libName = row.getElementsByTagName("LBRRY_NAME")[0].childNodes[0].nodeValue;
	            libNum = row.getElementsByTagName("LBRRY_SEQ_NO")[0].childNodes[0].nodeValue;
	            
	            var markerPosition  = new daum.maps.LatLng(lat, lon); 
	            
	            var marker = new daum.maps.Marker({
	            	map:map,
	            	position: markerPosition,
	            	image : markerImage
	            });
	            
	            var iwContent = '<div class="info">' + libName + 
	            '<br><a onclick="handleDetails(' + libNum + ')">자세히 보기</a>' +
	            '</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

	            iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

	        	// 인포윈도우를 생성합니다
	        	var infowindow = new daum.maps.InfoWindow({
	        	    content : iwContent,
	        	    removable : iwRemoveable
	        	});
	        	
	        	infowindow.open(map, marker); 
	        	
	        	map.setCenter(markerPosition); //지도의 중심좌표 이동
	        	
	        	break;
	        }
	    }
    }    
}

function listLibrary(xml){
    
	location.href="#list";
	
	var xmlDoc = xml.responseXML;
    var listDiv = document.getElementById("list");
    	library = xmlDoc.getElementsByTagName("row");
    	
    for (var i = 0; i < library.length; i++) {
    	var row = library[i];
        var div = document.createElement("div");
        div.setAttribute("class", "listItem");
        
        var name = row.getElementsByTagName("LBRRY_NAME")[0].childNodes[0].nodeValue;
        var num = row.getElementsByTagName("LBRRY_SEQ_NO")[0].childNodes[0].nodeValue;
        
    	div.innerHTML = "<h2>" + name + "</h2>"
    			+ "<button onclick='handleDetails(" + num + ")'>자세히 보기";

        if (listDiv.childElementCount == 0) {
        	listDiv.appendChild(div);
        } else {
        	listDiv.insertBefore(div, listDiv.firstChild);
        }
    }
}

function detailsLibrary(xml,libNum){

	location.href="#details"; //id=details로 이동
	
	if(document.getElementById("details").firstChild != null)
		document.getElementById("details").firstChild.remove();
	
	if(document.getElementById("bookList").firstChild != null){
		var cell = document.getElementById("bookList");
		while ( cell.hasChildNodes() ) { cell.removeChild( cell.firstChild ); } 
	}
	

	var xmlDoc = xml.responseXML;
    var detailsDiv = document.getElementById("details");
    	library = xmlDoc.getElementsByTagName("row");
    	
    for (var i = 0; i < library.length; i++) {
    	var row = library[i];

        var num = row.getElementsByTagName("LBRRY_SEQ_NO")[0].childNodes[0].nodeValue;
        
        if(num == libNum){
	        var div = document.createElement("div");
	        div.setAttribute("class", "detailsItem");
	        
	        var name = row.getElementsByTagName("LBRRY_NAME")[0].childNodes[0].nodeValue;
	        var address = row.getElementsByTagName("ADRES")[0].childNodes[0].nodeValue;
	        var tel = row.getElementsByTagName("TEL_NO")[0].childNodes[0].nodeValue;
	        var home = row.getElementsByTagName("HMPG_URL")[0].childNodes[0].nodeValue;
	        var closeDate = row.getElementsByTagName("FDRM_CLOSE_DATE")[0].childNodes[0].nodeValue;
	       
	    	div.innerHTML = "<h2>" + name + "</h2>"
	    		+ "<p>주소 : " + address + "</p>"
	    		+ "<p>전화번호 : " + tel + "</p>"
	    		+ "<p>홈페이지 : <a href='" + home + "' target='blank'>" + home + "</a></p>"
	    		+ "<p>휴관일 : " + closeDate + "</p>";

	    	handleBook(name);
	    	
	        if (detailsDiv.childElementCount == 0) {
	        	detailsDiv.appendChild(div);
	        } else {
	        	detailsDiv.insertBefore(div, detailsDiv.firstChild);
	        }
	        
	        break;
        }
    }
    
	
}

function bookList(xml, libName){
	var xmlDoc = xml.responseXML;
    var bookDiv = document.getElementById("bookList");
    	book = xmlDoc.getElementsByTagName("row");
    	
    	var row = book[0];

        var name = row.getElementsByTagName("LBRRY_NAME")[0].childNodes[0].nodeValue;
        
        if(name == libName){
	        var div = document.createElement("div");
	        div.setAttribute("class", "booksItem");
	        
	        var name = row.getElementsByTagName("BOOK_NM")[0].childNodes[0].nodeValue;
	        var author = row.getElementsByTagName("AUTHOR")[0].childNodes[0].nodeValue;
	        var publish = row.getElementsByTagName("PUBLSH")[0].childNodes[0].nodeValue;
	       
	    	div.innerHTML = "<p>이름 : " + name + "<br>"
	    		+ "작가 : " + author + "<br>"
	    		+ "출판사 : " + publish + "</p>";
	    	
	        if (bookDiv.childElementCount == 0) {
	        	bookDiv.appendChild(div);
	        } else {
	        	bookDiv.insertBefore(div, bookDiv.firstChild);
	        }
        }
}

function cleanSearchTxt(){
	document.getElementById("searchTxt").value = ""; //searchTxt에 있는 내용을 모두 없애줌
}
