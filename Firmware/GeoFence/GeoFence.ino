/*
  GeoFence Board Firmware
  By: Nick Poole
  SparkFun Electronics
  Date: July 10th, 2017
  License: This code is public domain but you buy me a beer if you use this and we meet someday (Beerware license).
*/

#include <SparkFun_I2C_GPS_Arduino_Library.h> //Use Library Manager or download here: https://github.com/sparkfun/SparkFun_I2C_GPS_Arduino_Library
I2CGPS myI2CGPS; //Hook object to the library

#include <TinyGPS++.h> //From: https://github.com/mikalhart/TinyGPSPlus
TinyGPSPlus gps; //Declare gps object

#include <EEPROM.h>

double zone1[5];
double zone2[5];
double zone3[5];
double zone4[5];
char zoneType[4];

int zoneIOPin[] = {4,6,8,10};

void setup() {

  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
  loadConfig();
  Serial.begin(115200);

  pinMode(5, OUTPUT);
  pinMode(7, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(11, OUTPUT);

  digitalWrite(5, LOW);
  digitalWrite(7, LOW);
  digitalWrite(9, LOW);
  digitalWrite(11, LOW);

  for(int z=0; z<4; z++){
    pinMode(zoneIOPin[z], OUTPUT);
    digitalWrite(zoneIOPin[z], LOW);
  }

  //  configMode();

  if (myI2CGPS.begin() == false)
  {
    //Serial.println("Module failed to respond. Please check wiring.");
    while (1); //Freeze!
  }
  //Serial.println("GPS module found!");

}

void loop() {

  // Do GeoFence Things

  while (myI2CGPS.available()) //available() returns the number of new bytes available from the GPS module
  {
    gps.encode(myI2CGPS.read()); //Feed the GPS parser
  }

  if (gps.time.isUpdated() && gps.location.isValid()) //Check to see if new GPS info is available
  {
    Serial.println("Valid Data -> Updating");
    updateGeofence();
  }

  // Check for a new config

    if(Serial.available()){
      while (Serial.read() != '$') {};
      String configString = Serial.readString();
      configure(configString);
    }

}

void configure(String configString) {

  Serial.println("Clearing EEPROM");
  for (int i = 0 ; i < 100 ; i++) {
    EEPROM.write(i, 0);
  }
  Serial.println("EEPROM Cleared...");

  // Receive and Verify a configuration

  String linebuffer;
  int addr = 0;
  int strIndex = 0;
  int inByte = 0;
  boolean checksumPass = 0;
  int attempts = 0;

  while (!checksumPass && attempts < 5) {

    attempts++;

    digitalWrite(13, LOW);

    strIndex++;

    for (int zone = 0; zone < 4; zone++) {
      inByte = configString.charAt(strIndex); // Should contain Zone 1 Type (R/C/X)
      strIndex++; strIndex++;

      switch (inByte) {

        case 'R': //Zone is rectangular

          addr = 0 + (zone * 20);
          linebuffer.remove(0);
          while (configString.charAt(strIndex) != 10) {
            linebuffer += configString.charAt(strIndex);
            strIndex++;
          }
          strIndex++;
          str_to_double_to_EEPROM(linebuffer, addr);

          addr = 4 + (zone * 20);
          linebuffer.remove(0);
          while (configString.charAt(strIndex) != 10) {
            linebuffer += configString.charAt(strIndex);
            strIndex++;
          }
          strIndex++;
          str_to_double_to_EEPROM(linebuffer, addr);

          addr = 8 + (zone * 20);
          linebuffer.remove(0);
          while (configString.charAt(strIndex) != 10) {
            linebuffer += configString.charAt(strIndex);
            strIndex++;
          }
          strIndex++;
          str_to_double_to_EEPROM(linebuffer, addr);

          addr = 12 + (zone * 20);
          linebuffer.remove(0);
          while (configString.charAt(strIndex) != 10) {
            linebuffer += configString.charAt(strIndex);
            strIndex++;
          }
          strIndex++;
          str_to_double_to_EEPROM(linebuffer, addr);

          break;

        case 'C': //Zone is circular

          addr = 8 + (zone * 20);
          linebuffer.remove(0);
          while (configString.charAt(strIndex) != 10) {
            linebuffer += configString.charAt(strIndex);
            strIndex++;
          }
          strIndex++;
          str_to_double_to_EEPROM(linebuffer, addr);

          addr = 12 + (zone * 20);
          linebuffer.remove(0);
          while (configString.charAt(strIndex) != 10) {
            linebuffer += configString.charAt(strIndex);
            strIndex++;
          }
          strIndex++;
          str_to_double_to_EEPROM(linebuffer, addr);

          addr = 16 + (zone * 20);
          linebuffer.remove(0);
          while (configString.charAt(strIndex) != 10) {
            linebuffer += configString.charAt(strIndex);
            strIndex++;
          }
          strIndex++;
          str_to_double_to_EEPROM(linebuffer, addr);

          break;

        case 'X': //Zone is undefined
          break;

      }
    }

    strIndex = strIndex + 2;
    linebuffer.remove(0);
    while (configString.charAt(strIndex) != 10) {
      linebuffer += configString.charAt(strIndex);
      strIndex++;
    }

    int calcSum = 0;

    for (int r = 0; configString.charAt(r) != '^'; r++) {
      calcSum = calcSum + configString.charAt(r);
    }

    calcSum = calcSum + 140;
    calcSum = calcSum % 256;

    if (linebuffer.toInt() == calcSum) {
      Serial.print("$\n"); //Checksum passed
      checksumPass = 1;
    } else {
      Serial.print("!\n"); //Checksum failed
      linebuffer.remove(0);
      addr = 0;
      strIndex = 0;
      inByte = 0;
      delay(500);
    }
  }
}

void loadConfig() {

  // Pull config from EEPROM

  for (int i = 0; i < 5; i++) {
    EEPROM.get(i * 4, zone1[i]);
  }
  for (int i = 0; i < 5; i++) {
    EEPROM.get(20 + (i * 4), zone2[i]);
  }
  for (int i = 0; i < 5; i++) {
    EEPROM.get(40 + (i * 4), zone3[i]);
  }
  for (int i = 0; i < 5; i++) {
    EEPROM.get(60 + (i * 4), zone4[i]);
  }

  if (zone1[0] == 0 && zone1[2] == 0) {
    zoneType[0] = 'X';
  }
  if (zone1[0] == 0 && zone1[2] != 0) {
    zoneType[0] = 'C';
  }
  if (zone1[0] != 0) {
    zoneType[0] = 'R';
  }

  if (zone2[0] == 0 && zone2[2] == 0) {
    zoneType[1] = 'X';
  }
  if (zone2[0] == 0 && zone2[2] != 0) {
    zoneType[1] = 'C';
  }
  if (zone2[0] != 0) {
    zoneType[1] = 'R';
  }

  if (zone3[0] == 0 && zone3[2] == 0) {
    zoneType[2] = 'X';
  }
  if (zone3[0] == 0 && zone3[2] != 0) {
    zoneType[2] = 'C';
  }
  if (zone3[0] != 0) {
    zoneType[2] = 'R';
  }

  if (zone4[0] == 0 && zone4[2] == 0) {
    zoneType[3] = 'X';
  }
  if (zone4[0] == 0 && zone4[2] != 0) {
    zoneType[3] = 'C';
  }
  if (zone4[0] != 0) {
    zoneType[3] = 'R';
  }

}

void str_to_double_to_EEPROM(String str, int addr) {
  double bytes = str.toDouble();
  EEPROM.put(addr, bytes);
}

void updateGeofence() {

  for (int zone = 0; zone < 4; zone++) {

    switch (zoneType[zone]) {

      case 'R':
        Serial.print("Checking Rectangular Zone ");
        Serial.println(zone);
        digitalWrite(zoneIOPin[zone], checkRectangle(zone));
        break;

      case 'C':
        Serial.print("Checking Circular Zone ");
        Serial.println(zone);
        digitalWrite(zoneIOPin[zone], checkCircle(zone));
        break;

    }
  }
}

boolean checkRectangle(int zone) {

  double swLat, swLng, neLat, neLng;

  switch (zone) {

    case 0:
      neLat = zone1[0];
      neLng = zone1[1];
      swLat = zone1[2];
      swLng = zone1[3];
      break;

    case 1:
      neLat = zone2[0];
      neLng = zone2[1];
      swLat = zone2[2];
      swLng = zone2[3];
      break;

    case 2:
      neLat = zone3[0];
      neLng = zone3[1];
      swLat = zone3[2];
      swLng = zone3[3];
      break;

    case 3:
      neLat = zone4[0];
      neLng = zone4[1];
      swLat = zone4[2];
      swLng = zone4[3];
      break;
  }

  if (neLng < swLng) { //If this is true, we're stradling the 180th. This is bad for the maths.

    //We must slice the box into two boxes with the max of one being 180 and the min of the other being -180
    
    boolean zoneSubA = (min(neLng, swLng) > gps.location.lng() && gps.location.lng() > -180 && min(neLat, swLat) < gps.location.lat() && gps.location.lat() < max(neLat, swLat));
    boolean zoneSubB = (max(neLng, swLng) < gps.location.lng() && gps.location.lng() < 180 && min(neLat, swLat) < gps.location.lat() && gps.location.lat() < max(neLat, swLat));

    //If the current location falls into either of these halves, we're in the zone

    if(zoneSubA || zoneSubB){
      return 1;
    }else{
      return 0; //If not, return 0
    }

  } else { //In a more reasonable locale

    //Nothing too fancy here, if our point is between the top and bottom of the rectangle AND between the sides... we're in!

    Serial.println("Performing Box Test");

    Serial.print("Min(x1,x2): ");
    Serial.println(min(neLat, swLat), 6);
    Serial.print("Lat: ");
    Serial.println(gps.location.lat(), 6);
    Serial.print("Max(x1,x2): ");
    Serial.println(max(neLat, swLat), 6);
    Serial.print("Min(y1,y2): ");
    Serial.println(min(neLng, swLng), 6);
    Serial.print("Lng: ");
    Serial.println(gps.location.lng(), 6);
    Serial.print("Max(y1,y2): ");
    Serial.println(max(neLng, swLng), 6);
    
    if(min(neLat, swLat) < gps.location.lat() && gps.location.lat() < max(neLat, swLat) && min(neLng, swLng) < gps.location.lng() && gps.location.lng() < max(neLng, swLng)) {
      Serial.println("Box Test Passed");
      return 1;
    }else{
      Serial.println("Box Text Failed");
      return 0; //If not, return 0
    }

  }
}

boolean checkCircle(int zone) {

  double centerLat, centerLng, zoneRadius;

  switch (zone) {

    case 0:
      centerLat = zone1[2];
      centerLng = zone1[3];
      zoneRadius = zone1[4];
      break;

    case 1:
      centerLat = zone2[2];
      centerLng = zone2[3];
      zoneRadius = zone2[4];
      break;

    case 2:
      centerLat = zone3[2];
      centerLng = zone3[3];
      zoneRadius = zone3[4];
      break;

    case 3:
      centerLat = zone4[2];
      centerLng = zone4[3];
      zoneRadius = zone4[4];
      break;
  }

  double distanceToCenter =
    TinyGPSPlus::distanceBetween(
      gps.location.lat(),
      gps.location.lng(),
      centerLat,
      centerLng);

  Serial.println("Performing Circle Test");
  Serial.print("Distance To: ");
  Serial.println(distanceToCenter);
  Serial.print("Radius: ");
  Serial.println(zoneRadius);

  if (distanceToCenter < zoneRadius) {
    Serial.println("Circle Test Passed");
    return 1; 
  }else{
    Serial.println("Circle Test Failed");
        return 0;
        
  }
}


