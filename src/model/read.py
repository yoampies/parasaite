import cv2 as cv
import os

capture = cv.VideoCapture('img/ascLumEgg.mp4')

def rescaleFrame (frame, scale = 0.5):
        height = int(frame.shape[0] * scale)
        width = int(frame.shape[1] * scale)
        dimensions = (width, height)
        return cv.resize(frame, dimensions, interpolation=cv.INTER_AREA)

if not os.path.exists('img/frames'):
    os.makedirs('img/frames')

frame_count = 0
saved_count = 0

while True:
    isTrue, frame = capture.read()

    if not isTrue:
        print("Video ended")
        break

    rsFrame= rescaleFrame(frame)

    cv.imshow('Video', frame)

    frame_count +=  1

    if frame_count % 10 == 0:
        file_name = f'img/frames/frame_{saved_count}.jpg'
        cv.imwrite(file_name, rsFrame)
        saved_count += 1

    if cv.waitKey(1) & 0xFF==ord('d'):
        break

capture.release()
cv.destroyAllWindows()