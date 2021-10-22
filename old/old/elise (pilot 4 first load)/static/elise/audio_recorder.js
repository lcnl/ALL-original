/*
jsPsych plugin that records audio clips, converts them to mp3 and saves them to the server
Giulia Bovolenta
Based on Recorder.js by Matt Diamond and Recordmp3js by Audior
*/
/*
License (MIT)
Copyright Â© 2013 Matt Diamond
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

/* edited by Arella Gussow 08/21 to include four target images that rotate around each other. script is
based on previous version by Yuzhe Gu, research assistant at LCNL, UW-Madison, 2020.
edited by Elise Hopman 09/21 to go back to simple audio recording
*/

jsPsych.plugins["audio_recorder"] = (function () {

  var plugin = {};



  //   ================ PLUGIN INFO ===========

  plugin.info = {
    name: "audio_recorder",
    description: "",
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Prompt',
        default: undefined,
        description: 'Any content here will be displayed on screen - can be HTML.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: -1,
        description: 'The duration of recording.'
      },
      file_name_recording: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'File name for the recording',
        default: 'test_filename',
        description: 'name under which to save recroding'
      },
      subjectID: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'placeholder',
        default: 'subjectID',
        description: 'placeholder'
      }
    }
  }


    ///// ============== RUN TRIAL =============== ////

  plugin.trial = function(display_element, trial) {


    trial.trial_duration = trial.trial_duration || -1;


   // ------ VISUAL FEATURES ------ //


   function getExperiment() {
    //location.pathname will look like
    // "/experiment/NAME/"
    var urlparts = window.location.href.split("/");
    return urlparts[urlparts.length - 2];
   }


   // ------ SOUND RECORDER ----- //
   function sendWAVData( blob, participant, filename ) {
    //console.log("from function");
    $.ajax(
      {
      url:  "/upload/",
      type: "POST",
      data: blob,
      contentType:  "audio/mp3",
      headers:  {
          "experiment": getExperiment(),
          "participant":  participant,
          "filename": filename
          },
      processData:  false,
      success: function(data, textStatus, jqXHR){
        console.log("success");
        },
      error: function(jqXHR, textStatus, errorThrown){
        console.log("ajax error");
        console.log(textStatus)
        console.log(errorThrown);
        },
      }
    );
   }



  var WORKER_PATH = 'static/elise/scripts/recorder/recorderWorker.js';
  var encoderWorker = new Worker('static/elise/scripts/recorder/mp3Worker.js');
  console.log("New encoder worker created");
  console.log(WORKER_PATH)

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    var numChannels = config.numChannels || 2;
    //console.log(typeof source.context);
    this.context = source.context;
    this.node = (this.context.createScriptProcessor ||
                 this.context.createJavaScriptNode).call(this.context,
                 bufferLen, numChannels, numChannels);

    var worker = new Worker(config.workerPath || WORKER_PATH);

    console.log("New worker created");

    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        numChannels: numChannels
      }
    });
    var recording = false,
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      var buffer = [];
      for (var channel = 0; channel < numChannels; channel++){
          buffer.push(e.inputBuffer.getChannelData(channel));
      }


      worker.postMessage({
        command: 'record',
        buffer: buffer
      });
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffer = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffer' })
    }

    this.exportWAV = function(type){
      type = type || config.type || 'audio/wav';
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    }
    //sendWAVData(this.exportWAV, 'test', 'test.wav');


  //Mp3 conversion
    worker.onmessage = function(e){
      var blob = e.data;
      console.log(trial.file_name_recording)
      var filenam = trial.file_name_recording + '.wav'
      console.log(filenam)
      sendWAVData(blob, trial.subjectID.toString(), filenam);

    }


  function encode64(buffer) {
    var binary = '',
      bytes = new Uint8Array( buffer ),
      len = bytes.byteLength;

    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  function parseWav(wav) {
    function readInt(i, bytes) {
      var ret = 0,
        shft = 0;

      while (bytes) {
        ret += wav[i] << shft;
        shft += 8;
        i++;
        bytes--;
      }
      return ret;
    }
    if (readInt(20, 2) != 1) throw 'Invalid compression code, not PCM';
    if (readInt(22, 2) != 1) throw 'Invalid number of channels, not 1';
    return {
      sampleRate: readInt(24, 4),
      bitsPerSample: readInt(34, 2),
      samples: wav.subarray(44)
    };
  }

  function Uint8ArrayToFloat32Array(u8a){
    var f32Buffer = new Float32Array(u8a.length);
    for (var i = 0; i < u8a.length; i++) {
      var value = u8a[i<<1] + (u8a[(i<<1)+1]<<8);
      if (value >= 0x8000) value |= ~0x7FFF;
      f32Buffer[i] = value / 0x8000;
    }
    return f32Buffer;
  }

  function uploadAudio(mp3Data){
    var reader = new FileReader();
    reader.onload = function(event){
      var fd = new FormData();
      var mp3Name = trial.file_name_recording + '.mp3'
      console.log("mp3name = " + mp3Name);
            fd.append('subjectID', window.subjectID); // Add subject ID
      fd.append('fname', mp3Name);
      fd.append('data', event.target.result);
      // $.ajax({
      //  type: 'post',
      //  url: 'static/UPS-l/scripts/recorder/upload.php',
      //  data: fd,
      //  processData: false,
      //  contentType: false
      // }).done(function(data) {
      //  //console.log(data);
      //  console.log("File " + mp3Name + " uploaded.");
      // });
      console.log("before function");
      sendWAVData(mp3Data, Window.subjectID, trial.file_name_recording + '.wav');
    };
    //reader.readAsDataURL(mp3Data);
  }

    source.connect(this.node);
    this.node.connect(this.context.destination);    //this should not be necessary
  };



  // --- Recorder functions --- //

  function startRecording() {
    recorder && recorder.record();
    console.log("Start");
  }

  function stopRecording() {
    recorder && recorder.stop();
    console.log("Stop");
    // create WAV download link using audio data blob
    createDownloadLink();
    recorder.clear();
    var newhtml = '<div><img width = "200" src = "static/elise/img/images/redx.png" style="position:absolute;top:35%;left:44%"></img></div>';
    display_element.innerHTML = newhtml;


  }

  function createDownloadLink() { // data to be written to the json
    recorder && recorder.exportWAV();
    console.log ('this should be exporting')
    var trial_data = {
      // trial_duration: trial.trial_duration,
      // trial_num: trial.trial_num,
      // itemID: trial.itemID,
      // subjectID: trial.subjectID,
      // condition: trial.condition,
      // question: trial.question,
      // list: trial.listnum,
      // pic1FILE: trial.pic1,
      // pic2FILE: trial.pic2,
      // pic3FILE: trial.pic3,
      // pic4FILE: trial.pic4,
      audioName: trial.file_name_recording + '.wav'
    }
    jsPsych.finishTrial(trial_data);
  }


  function showex(){

    // add stimulus and initialize trial parameters
    let html = '<div id="jspsych-html-audio-response-stimulus">'+trial.stimulus+'</div>';
    display_element.innerHTML = html;
    setTimeout(stopRecording, 10) 
  }


    ////// ------- Execute trial ------ ///////


    // Create new recorder object
    var recorder;
    recorder = new Recorder(window.input, {
            numChannels: 1
                 });
    console.log('Recorder initialised.');


    // Start recording
    $("img").ready(startRecording);

    // Stop recording
    setTimeout(showex, 10); 


  };
  return plugin;
})();