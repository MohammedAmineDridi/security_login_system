import cv2 as cv
import time

camera = cv.VideoCapture(0)
name = 1

while(True):
 ret, image = camera.read()
 cv.imwrite('img_user'+str(name)+'.jpg', image)
 time.sleep(3)
 name+=1
 if( name > 2 ) :	
  break
camera.release()
cv.destroyAllWindows()