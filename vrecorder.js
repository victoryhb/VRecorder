var VRecorder = function (options) {
    var options = Object.assign({}, {
        onReady: function (recorder, stream) {
        },
        onStart: function (recorder) {
        },
        onStop: function (recorder) {
        },
        onStopped: function (recorder, blob) {
        },
    }, options);

    navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);
    self = this;

    var mediaRecorder;
    var chunks = [];

    this.start = function () {
        options.onStart(self);
        mediaRecorder.start();
        // console.log(mediaRecorder.state);
    }

    this.stop = function () {
        options.onStop(self);
        mediaRecorder.stop();
        // console.log(mediaRecorder.state);
        // mediaRecorder.requestData();
    }

    var onStopped = function (e) {
        // data available after MediaRecorder.stop() has been called.
        var blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'});
        chunks = [];
        options.onStopped(self, blob);
        console.log("recorder stopped");
    }

    var onSuccess = function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.onstop = onStopped;
        options.onReady(self, stream);
        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
        }
    }

    var onError = function (err) {
        console.log('The following error occured: ' + err);
    }

    if (navigator.getUserMedia) {
        console.log('getUserMedia supported.');

        var constraints = {audio: true};

        navigator.getUserMedia(constraints, onSuccess, onError);
    } else {
        console.log('getUserMedia not supported on your browser!');
    }
}

