#define LED D1 
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
 
const char* ssid = "ya ga7af";
const char* password = "ga7af2019";


void delete_all(){

  
    HTTPClient http;
  WiFiClient c ;
  String URL = "http://192.168.137.1:3000/delete_all" ; // Works with HTTP
  Serial.println(URL);
  http.begin(c,URL); // Works with HTTP
    int httpCode = http.GET();                                  //Send the request
      String payload = http.getString();   //Get the request response payload
      Serial.println(payload);             //Print the response payload
    http.end();   //Close connection
 
}
 
void setup () {
 
  Serial.begin(115200);

  pinMode(LED, OUTPUT);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
 
    delay(1000);
    Serial.print("Connecting..");
 
  }
 
}
 
void loop() {
 
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
    HTTPClient http;
  WiFiClient c ;
  String URL = "http://192.168.137.1:3000/number_failure" ; // Works with HTTP
  Serial.println(URL);
  http.begin(c,URL); // Works with HTTP
    int httpCode = http.GET();                                  //Send the request
 
    if (httpCode > 0) { //Check the returning code
 
      String payload = http.getString();   //Get the request response payload
      Serial.println(payload);             //Print the response payload

  
    if( payload == "3"  ){
      Serial.println("reponse = 3 ");

        for(int i=0 ; i < 5 ; i++){
          digitalWrite(LED, HIGH);
        delay(500);
        digitalWrite(LED, LOW);
        delay(500);
          }

          // deleted all alerts .

          delay(1000);

          delete_all() ;

          delay(1000);
      }
      else{
        Serial.println("response diff de 3");
        }
 
    }
 
    http.end();   //Close connection
 
  }
 
  delay(1000);    //Send a request every 30 seconds
}
