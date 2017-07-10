var activeLoc = 0;
var boundaryOne = 0;
var boundaryTwo = 0;
var boundaryThree = 0;
var boundaryFour = 0;
var boundaryIsCirc = [0, 1, 1, 1, 1];
var map = 0;
var SerialPort = require('serialport');
var port;
var data;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {
      lat: 40.014986,
      lng: -105.270546
    }
  });

  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
  });

  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

}

function serialSwitch() {
	
	port = new SerialPort(document.getElementById("serialPortNum").value, {
		parser: SerialPort.parsers.readline('\n'),
		baudRate: 9600
		});
	
	port.on('data', function(x){
		switch(x){
			
			case '!':
				port.write(data);
				statusBar("failed checksum... trying again...");
				break;
				
			case '$':
				statusBar("configuration successfully written to board!");
				break;
			
			default:
			
				break;
			
		}
	});
		
	statusBar("opened serial port on " + document.getElementById("serialPortNum").value + "...");
	
}

function findDevices() {
	
	statusBar("searching for devices...");
	
	document.getElementById("serialPortNum").innerHTML = '';
	SerialPort.list(function (err, ports) {
		ports.forEach(function(port) {
			var portEntry = document.createElement('option');
			portEntry.value = port.comName;
			portEntry.innerHTML = port.comName;
			document.getElementById("serialPortNum").appendChild(portEntry);
			console.log(port.comName);
  });
});	

	setTimeout(function() {
		statusBar("found " + document.getElementById("serialPortNum").childNodes.length + " serial devices...");
	}, 1000);
}

function placeMarkerAndPanTo(latLng, map) {

  var bounds = {
    north: latLng.lat() + .0008,
    south: latLng.lat() - .0008,
    east: latLng.lng() + .0008,
    west: latLng.lng() - .0008
  };

  switch (activeLoc) {

    case 0:
      break;

    case 1:

      if (boundaryOne != 0) {

        if (boundaryIsCirc[1] == 0) {
          boundaryOne.setBounds(bounds);
          boundaryOne.setMap(map);
        } else {
          boundaryOne.setCenter(latLng);
          boundaryOne.setMap(map);
        }

      } else {

        if (boundaryIsCirc[1] == 0) {
          boundaryOne = new google.maps.Rectangle({
            bounds: bounds,
            editable: true,
            fillColor: '#FF0000',
          });
          boundaryOne.addListener('bounds_changed', function() {
            updateCoords('R', 1);
          });
        } else {
          boundaryOne = new google.maps.Circle({
            fillColor: '#FF0000',
            map: map,
            center: latLng,
            editable: true,
            radius: 100
          });
          boundaryOne.addListener('center_changed', function() {
            updateCoords('C', 1);
          });
          boundaryOne.addListener('radius_changed', function() {
            updateCoords('C', 1);
          });
        }
        boundaryOne.setMap(map);
      }
      break;

    case 2:

      if (boundaryTwo != 0) {

        if (boundaryIsCirc[2] == 0) {
          boundaryTwo.setBounds(bounds);
          boundaryTwo.setMap(map);
        } else {
          boundaryTwo.setCenter(latLng);
          boundaryTwo.setMap(map);
        }

      } else {

        if (boundaryIsCirc[2] == 0) {
          boundaryTwo = new google.maps.Rectangle({
            bounds: bounds,
            editable: true,
            fillColor: '#00FF00',
          });
          boundaryTwo.addListener('bounds_changed', function() {
            updateCoords('R', 2);
          });
        } else {
          boundaryTwo = new google.maps.Circle({
            fillColor: '#00FF00',
            map: map,
            center: latLng,
            editable: true,
            radius: 100
          });
          boundaryTwo.addListener('center_changed', function() {
            updateCoords('C', 2);
          });
          boundaryTwo.addListener('radius_changed', function() {
            updateCoords('C', 2);
          });
        }
        boundaryTwo.setMap(map);
      }
      break;

    case 3:

      if (boundaryThree != 0) {

        if (boundaryIsCirc[3] == 0) {
          boundaryThree.setBounds(bounds);
          boundaryThree.setMap(map);
        } else {
          boundaryThree.setCenter(latLng);
          boundaryThree.setMap(map);
        }

      } else {

        if (boundaryIsCirc[3] == 0) {
          boundaryThree = new google.maps.Rectangle({
            bounds: bounds,
            editable: true,
            fillColor: '#FFFF00',
          });
          boundaryThree.addListener('bounds_changed', function() {
            updateCoords('R', 3);
          });
        } else {
          boundaryThree = new google.maps.Circle({
            fillColor: '#FFFF00',
            map: map,
            center: latLng,
            editable: true,
            radius: 100
          });
          boundaryThree.addListener('center_changed', function() {
            updateCoords('C', 3);
          });
          boundaryThree.addListener('radius_changed', function() {
            updateCoords('C', 3);
          });
        }
        boundaryThree.setMap(map);
      }
      break;

    case 4:

      if (boundaryFour != 0) {

        if (boundaryIsCirc[4] == 0) {
          boundaryFour.setBounds(bounds);
          boundaryFour.setMap(map);
        } else {
          boundaryFour.setCenter(latLng);
          boundaryFour.setMap(map);
        }

      } else {

        if (boundaryIsCirc[4] == 0) {
          boundaryFour = new google.maps.Rectangle({
            bounds: bounds,
            editable: true,
            fillColor: '#0000FF',
          });
          boundaryFour.addListener('bounds_changed', function() {
            updateCoords('R', 4);
          });
        } else {
          boundaryFour = new google.maps.Circle({
            fillColor: '#0000FF',
            map: map,
            center: latLng,
            editable: true,
            radius: 100
          })
          boundaryFour.addListener('center_changed', function() {
            updateCoords('C', 4);
          });
          boundaryFour.addListener('radius_changed', function() {
            updateCoords('C', 4);
          });
        }
        boundaryFour.setMap(map);
      }
      break;

  }

  map.panTo(latLng);
}

function editLoc(locNum) {

  if (activeLoc != locNum) {
    // Select Location Slot
    switch (locNum) {
      case 1:
        statusBar("editing zone 1...");
        document.getElementById("locOneBar").className = "active";
        document.getElementById("locTwoBar").className = "faded";
        document.getElementById("locThreeBar").className = "faded";
        document.getElementById("locFourBar").className = "faded";

        if (boundaryOne != 0) {
          map.panTo(boundaryOne.getBounds().getCenter());
          boundaryOne.setEditable(true);
          boundaryOne.setDraggable(true);
        }

        break;
      case 2:
        statusBar("editing zone 2...");
        document.getElementById("locOneBar").className = "faded";
        document.getElementById("locTwoBar").className = "active";
        document.getElementById("locThreeBar").className = "faded";
        document.getElementById("locFourBar").className = "faded";

        if (boundaryTwo != 0) {
          map.panTo(boundaryTwo.getBounds().getCenter());
          boundaryTwo.setEditable(true);
          boundaryTwo.setDraggable(true);
        }

        break;
      case 3:
        statusBar("editing zone 3...");
        document.getElementById("locOneBar").className = "faded";
        document.getElementById("locTwoBar").className = "faded";
        document.getElementById("locThreeBar").className = "active";
        document.getElementById("locFourBar").className = "faded";

        if (boundaryThree != 0) {
          map.panTo(boundaryThree.getBounds().getCenter());
          boundaryThree.setEditable(true);
          boundaryThree.setDraggable(true);
        }

        break;
      case 4:
        statusBar("editing zone 4...");
        document.getElementById("locOneBar").className = "faded";
        document.getElementById("locTwoBar").className = "faded";
        document.getElementById("locThreeBar").className = "faded";
        document.getElementById("locFourBar").className = "active";

        if (boundaryFour != 0) {
          map.panTo(boundaryFour.getBounds().getCenter());
          boundaryFour.setEditable(true);
          boundaryFour.setDraggable(true);
        }

        break;
    }
    activeLoc = locNum;



  } else {
    // Unselect Location Slot
    statusBar("left editing mode...");
    document.getElementById("locOneBar").className = "active";
    document.getElementById("locTwoBar").className = "active";
    document.getElementById("locThreeBar").className = "active";
    document.getElementById("locFourBar").className = "active";
    activeLoc = 0;

    if (boundaryOne != 0) {
      boundaryOne.setEditable(false);
      boundaryOne.setDraggable(false);
    }
    if (boundaryTwo != 0) {
      boundaryTwo.setEditable(false);
      boundaryTwo.setDraggable(false);
    }
    if (boundaryThree != 0) {
      boundaryThree.setEditable(false);
      boundaryThree.setDraggable(false);
    }
    if (boundaryFour != 0) {
      boundaryFour.setEditable(false);
      boundaryFour.setDraggable(false);
    }

  }
}

function delLoc(locNum) {

  switch (locNum) {

    case 1:
      if (boundaryOne != 0) {
        boundaryOne.setMap(null);
        boundaryOne = 0;
        statusBar("removed zone boundary " + locNum);
        updateCoords('X', 1);
      } else {
        statusBar("no zone boundary to delete!");
      }
      break;
    case 2:
      if (boundaryTwo != 0) {
        boundaryTwo.setMap(null);
        boundaryTwo = 0;
        statusBar("removed zone boundary " + locNum);
        updateCoords('X', 2);
      } else {
        statusBar("no zone boundary to delete!");
      }
      break;
    case 3:
      if (boundaryThree != 0) {
        boundaryThree.setMap(null);
        boundaryThree = 0;
        statusBar("removed zone boundary " + locNum);
        updateCoords('X', 3);
      } else {
        statusBar("no zone boundary to delete!");
      }
      break;
    case 4:
      if (boundaryFour != 0) {
        boundaryFour.setMap(null);
        boundaryFour = 0;
        statusBar("removed zone boundary " + locNum);
        updateCoords('X', 4);
      } else {
        statusBar("no zone boundary to delete!");
      }
      break;


  }
}

function logDump() {

  data = "$\n";

  if (boundaryOne != 0 && boundaryIsCirc[1] == 0) {
    data += "R\n";
    data += boundaryOne.getBounds().getNorthEast().lat().toFixed(6) + "\n";
    data += boundaryOne.getBounds().getNorthEast().lng().toFixed(6) + "\n";
    data += boundaryOne.getBounds().getSouthWest().lat().toFixed(6) + "\n";
    data += boundaryOne.getBounds().getSouthWest().lng().toFixed(6) + "\n";
  } else if (boundaryOne != 0 && boundaryIsCirc[1] == 1) {
    data += "C\n";
    data += boundaryOne.getCenter().lat().toFixed(6) + "\n";
    data += boundaryOne.getCenter().lng().toFixed(6) + "\n";
    data += boundaryOne.getRadius().toFixed(0) + "\n";
  } else {
    data += "X\n";
  }

  if (boundaryTwo != 0 && boundaryIsCirc[2] == 0) {
    data += "R\n";
    data += boundaryTwo.getBounds().getNorthEast().lat().toFixed(6) + "\n";
    data += boundaryTwo.getBounds().getNorthEast().lng().toFixed(6) + "\n";
    data += boundaryTwo.getBounds().getSouthWest().lat().toFixed(6) + "\n";
    data += boundaryTwo.getBounds().getSouthWest().lng().toFixed(6) + "\n";
  } else if (boundaryTwo != 0 && boundaryIsCirc[2] == 1) {
    data += "C\n";
    data += boundaryTwo.getCenter().lat().toFixed(6) + "\n";
    data += boundaryTwo.getCenter().lng().toFixed(6) + "\n";
    data += boundaryTwo.getRadius().toFixed(0) + "\n";
  } else {
    data += "X\n";
  }

  if (boundaryThree != 0 && boundaryIsCirc[3] == 0) {
    data += "R\n";
    data += boundaryThree.getBounds().getNorthEast().lat().toFixed(6) + "\n";
    data += boundaryThree.getBounds().getNorthEast().lng().toFixed(6) + "\n";
    data += boundaryThree.getBounds().getSouthWest().lat().toFixed(6) + "\n";
    data += boundaryThree.getBounds().getSouthWest().lng().toFixed(6) + "\n";
  } else if (boundaryThree != 0 && boundaryIsCirc[3] == 1) {
    data += "C\n";
    data += boundaryThree.getCenter().lat().toFixed(6) + "\n";
    data += boundaryThree.getCenter().lng().toFixed(6) + "\n";
    data += boundaryThree.getRadius().toFixed(0) + "\n";
  } else {
    data += "X\n";
  }

  if (boundaryFour != 0 && boundaryIsCirc[4] == 0) {
    data += "R\n";
    data += boundaryFour.getBounds().getNorthEast().lat().toFixed(6) + "\n";
    data += boundaryFour.getBounds().getNorthEast().lng().toFixed(6) + "\n";
    data += boundaryFour.getBounds().getSouthWest().lat().toFixed(6) + "\n";
    data += boundaryFour.getBounds().getSouthWest().lng().toFixed(6) + "\n";
  } else if (boundaryFour != 0 && boundaryIsCirc[4] == 1) {
    data += "C\n";
    data += boundaryFour.getCenter().lat().toFixed(6) + "\n";
    data += boundaryFour.getCenter().lng().toFixed(6) + "\n";
    data += boundaryFour.getRadius().toFixed(0) + "\n";
  } else {
    data += "X\n";
  }

  data += "^\n";
  
  var chksum = 0;
  
  for(var i = 0; i < data.length; i++){
	 chksum = chksum + data.charCodeAt(i); 
  }
  
  chksum = chksum%256;
  
  data += chksum;
  data += "\n"
  data += "$";

  
  console.log(data);
  
  if(port == undefined){
	  
	statusBar("no serial port open...");  
	  
  }
  
  if(port.isOpen == false){
	  
	statusBar("no serial port open...");
	  
  }else{
	  
	port.write(data);
	
	}

}


function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function makeBox(locNum) {

  statusBar("changed zone " + locNum + " to rectangular mode...");

  switch (locNum) {

    case 1:

      document.getElementById("boxOne").className = "ctrlsSEL";
      document.getElementById("circOne").className = "ctrls";

      if (boundaryOne != 0) {
        var bounds = {
          north: boundaryOne.getCenter().lat() + .0008,
          south: boundaryOne.getCenter().lat() - .0008,
          east: boundaryOne.getCenter().lng() + .0008,
          west: boundaryOne.getCenter().lng() - .0008
        };
        delLoc(1);
        boundaryOne = new google.maps.Rectangle({
          bounds: bounds,
          fillColor: '#FF0000',
        });
        boundaryOne.addListener('bounds_changed', function() {
          updateCoords('R', 1);
        });
        boundaryOne.setMap(map);
        if (activeLoc == 1) {
          boundaryOne.setEditable(true);
        }
      }

      break;

    case 2:

      document.getElementById("boxTwo").className = "ctrlsSEL";
      document.getElementById("circTwo").className = "ctrls";

      if (boundaryTwo != 0) {
        var bounds = {
          north: boundaryTwo.getCenter().lat() + .0008,
          south: boundaryTwo.getCenter().lat() - .0008,
          east: boundaryTwo.getCenter().lng() + .0008,
          west: boundaryTwo.getCenter().lng() - .0008
        };
        delLoc(2);
        boundaryTwo = new google.maps.Rectangle({
          bounds: bounds,
          fillColor: '#00FF00',
        });
        boundaryTwo.addListener('bounds_changed', function() {
          updateCoords('R', 2);
        });
        boundaryTwo.setMap(map);
        if (activeLoc == 2) {
          boundaryTwo.setEditable(true);
        }
      }

      break;

    case 3:

      document.getElementById("boxThree").className = "ctrlsSEL";
      document.getElementById("circThree").className = "ctrls";

      if (boundaryThree != 0) {
        var bounds = {
          north: boundaryThree.getCenter().lat() + .0008,
          south: boundaryThree.getCenter().lat() - .0008,
          east: boundaryThree.getCenter().lng() + .0008,
          west: boundaryThree.getCenter().lng() - .0008
        };
        delLoc(3);
        boundaryThree = new google.maps.Rectangle({
          bounds: bounds,
          fillColor: '#FFFF00',
        });
        boundaryThree.addListener('bounds_changed', function() {
          updateCoords('R', 3);
        });
        boundaryThree.setMap(map);
        if (activeLoc == 3) {
          boundaryThree.setEditable(true);
        }
      }

      break;

    case 4:

      document.getElementById("boxFour").className = "ctrlsSEL";
      document.getElementById("circFour").className = "ctrls";

      if (boundaryFour != 0) {
        var bounds = {
          north: boundaryFour.getCenter().lat() + .0008,
          south: boundaryFour.getCenter().lat() - .0008,
          east: boundaryFour.getCenter().lng() + .0008,
          west: boundaryFour.getCenter().lng() - .0008
        };
        delLoc(4);
        boundaryFour = new google.maps.Rectangle({
          bounds: bounds,
          fillColor: '#0000FF',
        });
        boundaryFour.addListener('bounds_changed', function() {
          updateCoords('R', 4);
        });
        boundaryFour.setMap(map);
        if (activeLoc == 4) {
          boundaryFour.setEditable(true);
        }
      }

      break;
  }

  boundaryIsCirc[locNum] = 0;
  updateCoords('R', locNum);

}

function makeCirc(locNum) {

  statusBar("changed zone " + locNum + " to circular mode...");

  switch (locNum) {

    case 1:

      document.getElementById("boxOne").className = "ctrls";
      document.getElementById("circOne").className = "ctrlsSEL";

      if (boundaryOne != 0) {
        var boxCenter = boundaryOne.getBounds().getCenter();
        delLoc(1);
        boundaryOne = new google.maps.Circle({
          fillColor: '#FF0000',
          map: map,
          center: boxCenter,
          radius: 100
        })
        boundaryOne.addListener('center_changed', function() {
          updateCoords('C', 1);
        });
        boundaryOne.addListener('radius_changed', function() {
          updateCoords('C', 1);
        });
        boundaryOne.setMap(map);
        if (activeLoc == 1) {
          boundaryOne.setEditable(true);
        }
      }
      break;

    case 2:
      document.getElementById("boxTwo").className = "ctrls";
      document.getElementById("circTwo").className = "ctrlsSEL";

      if (boundaryTwo != 0) {
        var boxCenter = boundaryTwo.getBounds().getCenter();
        delLoc(2);
        boundaryTwo = new google.maps.Circle({
          fillColor: '#00FF00',
          map: map,
          center: boxCenter,
          radius: 100
        })
        boundaryTwo.addListener('center_changed', function() {
          updateCoords('C', 2);
        });
        boundaryTwo.addListener('radius_changed', function() {
          updateCoords('C', 2);
        });
        boundaryTwo.setMap(map);
        if (activeLoc == 2) {
          boundaryTwo.setEditable(true);
        }
      }
      break;
    case 3:
      document.getElementById("boxThree").className = "ctrls";
      document.getElementById("circThree").className = "ctrlsSEL";

      if (boundaryThree != 0) {
        var boxCenter = boundaryThree.getBounds().getCenter();
        delLoc(3);
        boundaryThree = new google.maps.Circle({
          fillColor: '#FFFF00',
          map: map,
          center: boxCenter,
          radius: 100
        })
        boundaryThree.addListener('center_changed', function() {
          updateCoords('C', 3);
        });
        boundaryThree.addListener('radius_changed', function() {
          updateCoords('C', 3);
        });
        boundaryThree.setMap(map);
        if (activeLoc == 3) {
          boundaryThree.setEditable(true);
        }
      }
      break;
    case 4:
      document.getElementById("boxFour").className = "ctrls";
      document.getElementById("circFour").className = "ctrlsSEL";

      if (boundaryFour != 0) {
        var boxCenter = boundaryFour.getBounds().getCenter();
        delLoc(4);
        boundaryFour = new google.maps.Circle({
          fillColor: '#0000FF',
          map: map,
          center: boxCenter,
          radius: 100
        })
        boundaryFour.addListener('center_changed', function() {
          updateCoords('C', 4);
        });
        boundaryFour.addListener('radius_changed', function() {
          updateCoords('C', 4);
        });
        boundaryFour.setMap(map);
        if (activeLoc == 4) {
          boundaryFour.setEditable(true);
        }
      }
      break;
  }

  boundaryIsCirc[locNum] = 1;
  updateCoords('C', locNum);

}

function statusBar(statusString) {

  document.getElementById('status').innerHTML = statusString;

  setTimeout(function() {
    document.getElementById('status').innerHTML = "ready... \(Hover over icons for tooltips!\)";
  }, 1000);

}

function updateCoords(shape, locNum) {

  if (shape == "C") {

    switch (locNum) {

      case 1:
        document.getElementById('locData1').value = "CENTER: " + boundaryOne.getCenter().lat().toFixed(6) + "," + boundaryOne.getCenter().lng().toFixed(6) + "\nRADIUS: " + boundaryOne.getRadius().toFixed(0);
        break;
      case 2:
        document.getElementById('locData2').value = "CENTER: " + boundaryTwo.getCenter().lat().toFixed(6) + "," + boundaryTwo.getCenter().lng().toFixed(6) + "\nRADIUS: " + boundaryTwo.getRadius().toFixed(0);
        break;
      case 3:
        document.getElementById('locData3').value = "CENTER: " + boundaryThree.getCenter().lat().toFixed(6) + "," + boundaryThree.getCenter().lng().toFixed(6) + "\nRADIUS: " + boundaryThree.getRadius().toFixed(0);
        break;
      case 4:
        document.getElementById('locData4').value = "CENTER: " + boundaryFour.getCenter().lat().toFixed(6) + "," + boundaryFour.getCenter().lng().toFixed(6) + "\nRADIUS: " + boundaryFour.getRadius().toFixed(0);
        break;

    }
  } else if (shape == "R") {

    switch (locNum) {

      case 1:
        document.getElementById('locData1').value = "NE\u25F9: " + boundaryOne.getBounds().getNorthEast().lat().toFixed(6) + "," + boundaryOne.getBounds().getNorthEast().lng().toFixed(6) + "\nSW\u25FA: " + boundaryOne.getBounds().getSouthWest().lat().toFixed(6) + "," + boundaryOne.getBounds().getSouthWest().lng().toFixed(6);
        break;
      case 2:
        document.getElementById('locData2').value = "NE\u25F9: " + boundaryTwo.getBounds().getNorthEast().lat().toFixed(6) + "," + boundaryTwo.getBounds().getNorthEast().lng().toFixed(6) + "\nSW\u25FA: " + boundaryTwo.getBounds().getSouthWest().lat().toFixed(6) + "," + boundaryTwo.getBounds().getSouthWest().lng().toFixed(6);
        break;
      case 3:
        document.getElementById('locData3').value = "NE\u25F9: " + boundaryThree.getBounds().getNorthEast().lat().toFixed(6) + "," + boundaryThree.getBounds().getNorthEast().lng().toFixed(6) + "\nSW\u25FA: " + boundaryThree.getBounds().getSouthWest().lat().toFixed(6) + "," + boundaryThree.getBounds().getSouthWest().lng().toFixed(6);
        break;
      case 4:
        document.getElementById('locData4').value = "NE\u25F9: " + boundaryFour.getBounds().getNorthEast().lat().toFixed(6) + "," + boundaryFour.getBounds().getNorthEast().lng().toFixed(6) + "\nSW\u25FA: " + boundaryFour.getBounds().getSouthWest().lat().toFixed(6) + "," + boundaryFour.getBounds().getSouthWest().lng().toFixed(6);
        break;

    }
  } else {

    switch (locNum) {

      case 1:
        document.getElementById('locData1').value = "No\nBoundary";
        break;
      case 2:
        document.getElementById('locData2').value = "No\nBoundary";
        break;
      case 3:
        document.getElementById('locData3').value = "No\nBoundary";
        break;
      case 4:
        document.getElementById('locData4').value = "No\nBoundary";
        break;

    }
  }
}
