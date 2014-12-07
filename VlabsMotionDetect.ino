/**
 * VlabsMotionDetect
 *
 * created  August 2014
 * by Valentin Ferriere
 * web : http://v-labs.fr
 *
 * sources :
 *   - https://learn.adafruit.com/pir-passive-infrared-proximity-motion-sensor/using-a-pir
 *   - https://learn.adafruit.com/ttl-serial-camera/using-the-camera
 *
 * This code is released under the MIT License.
 */

#include <Adafruit_VC0706.h>
#include <SoftwareSerial.h>

#define pirInputPin 2
#define cameraTX 8
#define cameraRX 7

boolean allowDetection = false;
boolean isHandlingPicture = false;
SoftwareSerial cameraConnection = SoftwareSerial(cameraTX, cameraRX);
Adafruit_VC0706 cam = Adafruit_VC0706(&cameraConnection);

void setup() 
{
  pinMode(pirInputPin, INPUT);
  Serial.begin(115200);

  initCamera();
}

void loop() 
{
  if(isMotionDetected() == true) {
    //Serial.println("Motion detected! - Wait a little");
    //delay(2000);
    Serial.println("Motion detected!");
    takePicture();
  }
}

/**
 * Check if PIR sensor detected a motion
 * Handle sensor state, so it does not spam if it's currently high
 * so it only return states change
 *
 * Return false also if picture is taken & we are transfering it
 *
 * @return boolean
 */
boolean isMotionDetected()
{
  if(isHandlingPicture == true) {
    return false;
  }

  int pirValue = digitalRead(pirInputPin);  

  if (pirValue == HIGH && allowDetection == true) {  
    allowDetection = false;

    return true;
  } 
  else {
    if(pirValue == HIGH && allowDetection == false) {

      return false;
    }

    if(pirValue == LOW && allowDetection == false) {
      allowDetection = true;

      return false; 
    }
  }

  // if pirValue = 0 && allowDetection = true
  return false;
}

/**
 * Check if camera if found & gives some information about it
 *
 * @return void
 */
void initCamera()
{
  if (cam.begin()) {
    Serial.println("Camera Found:");
  } 
  else {
    Serial.println("No camera found");
    return;
  }

  char *reply = cam.getVersion();
  if (reply == 0) {
    Serial.print("Failed to get version");
  } 
  else {
    Serial.print(reply);
    Serial.println("-----------------");
  }
}

/**
 * Take a picture and then call sendPicture()
 *
 * @return void
 */
void takePicture()
{
  isHandlingPicture = true;

  cam.setImageSize(VC0706_320x240);

  Serial.println("Snap time");

  if (!cam.takePicture()) {
    Serial.println("Failed to snap!");
    isHandlingPicture = false;
  }
  else {
    Serial.println("Picture taken!");
    sendPicture();
  }
}

/**
 * Send the picture data trought the serial port
 *
 * @return void
 */
void sendPicture()
{
  // Get the size of the image (frame) taken  
  uint16_t jpglen = cam.frameLength();
  Serial.print("Image frame length ");
  Serial.print(jpglen, DEC);
  Serial.println(" bytes.");

  Serial.println("BOF");
  delay(500);

  int32_t time = millis();
  while (jpglen > 0) {
    uint8_t *buffer;
    uint8_t bytesToRead = min(32, jpglen); 
    buffer = cam.readPicture(bytesToRead);
    Serial.write(buffer, bytesToRead);

    jpglen -= bytesToRead;
  }

  Serial.write("EOF");

  time = millis() - time;
  delay(500);

  Serial.print(time/1000); 
  Serial.println(" s elapsed");

  cam.reset();
}

/**
 * Handle new data coming from hardware serial RX
 * Reset boolean if \n is given
 *
 * @return void
 */
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read(); 
    if (inChar == '\n') {
      isHandlingPicture = false;
      Serial.println("Camera now available");
    } 
  }
}
