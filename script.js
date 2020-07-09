// const video = document.getElementById('video')
var video = document.querySelector("#videoElement");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://localhost/t/WebGLRunner/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://localhost/t/WebGLRunner/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('https://localhost/t/WebGLRunner/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://localhost/t/WebGLRunner/models')
]).then(startVideo)

function startVideo() {
  // navigator.getUserMedia(
    // { video: {} },
    // stream => video.srcObject = stream,
    // err => console.error(err)
  // )

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }

  // navigator.mediaDevices.getUserMedia({video: {}}) .then((stream)=> {video.srcObject = stream;}, (err)=> console.error(err));
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const faceval = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    // console.log(faceval[0]['expressions']['happy'])

    if(faceval[0]['expressions']['happy'] > 0.8 ){

      gameInstance.SendMessage('SmileGauge', 'getVal')

    }


  }, 100)
  
})