# GeoFence
A device to monitor when it is inside or outside various GPS waypoints.

# The GeoFence App is no longer supported
Unfortunately, Google has changed the way that they bill their Maps API and because we're no longer building the GeoFence hardware, 
we won't be updating the software. If you're looking for a way to create and enforce your own geofences, we encourage you to check out the [uBlox](https://learn.sparkfun.com/tutorials/getting-started-with-u-center-for-u-blox) products we now carry. If you still have a GeoFence board that you'd like to continue using, you have two options:

1. You can aqcuire your own [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key), 
replace our key string in the app source code (index.html line 77), and recompile the app in [electronjs](https://electronjs.org/).

2. You can construct your own configuration string using lat-long data from the source of your choosing and send it to the board using 
a serial terminal. Configuration strings are constructed as follows:

## Complete Configuration String

| Header | Zone 1 | Zone 2 | Zone 3 | Zone 4 | Footer | Chksum | Terminator |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ---------- |
| "$\n"  |        |        |        |        |  "^\n" |        |     "$"    |

## Zone Configuration

### Null Zone
The device expects to see configurations for each zone, even if the zone is "unprogrammed". Unprogrammed zones are marked with the "X" flag.

| Header |
| ------ |
|  "X\n" |

### Rectangular Zone
Rectangular Boundaries are defined by their NorthEast and SouthWest corners. The Latitude and Longitude of each corner is fixed to 
6 digits of precision after the decimal. Rectangular Zones are marked with the "R" Flag.

| Header | NorthEast Lat | NorthEast Long | SouthWest Lat | SouthWest Long | 
| ------ | ------------- | -------------- | ------------- | -------------- |
|  "R\n" | "xx.xxxxxx\n" |  "-x.xxxxxx\n" | "xxx.xxxxxx\n"| "xx.xxxxxx\n"  |

### Circular Zone
Circular Boundaries are defined by their center coordinate and their radius in meters, rounded to the nearest meter. 
Circular Zones are marked with the "C" flag.

| Header | Center Lat | Center Long | Radius Meters | 
| ------ | ---------- | ----------- | ------------- | 
|  "C\n" |"x.xxxxxx\n"|"-x.xxxxxx\n"|    "xxx\n"    |

### Checksum
Strings are transmitted with a checksum for integrity. The checksum is the sum of all character values in the string up to 
the checksum, modulo 256. It is calculated in the App thusly: 

```
  for(var i = 0; i < data.length; i++){
	 chksum = chksum + data.charCodeAt(i); 
  }
  
  chksum = chksum%256;
  ```
  
  The checksum value is written to a single byte and followed by a Line Feed ("\n")
  
### Serial Settings
The configuration string may be sent at any time at 9600 baud. The board will return with "$" if the configuration was succesful, if
the string did not pass checksum, it will return "!"
