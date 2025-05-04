import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../utils/api';

function GoLiveModal({ selectedCategory, onClose }) {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [caption, setCaption] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const startRecording = () => {
  const stream = webcamRef.current.stream;
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      setVideoPreviewUrl(videoURL);

      // Stop webcam stream
      const tracks = webcamRef.current?.stream?.getTracks();
      tracks?.forEach(track => track.stop());
      setShowCamera(false);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!caption || recordedChunks.length === 0) {
      toast.error('Please open camera, record a video, and enter a caption.');
      return;
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const file = new File([blob], 'live-video.webm', { type: 'video/webm' });

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('media', file);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('category', selectedCategory);
      formData.append('location', `${latitude}, ${longitude}`);

      try {
        const result = await apiRequest({
          method: 'POST',
          route: '/users/upload-post',
          formData,
        });

        if (result.success) {
          toast.success('Live video uploaded successfully!');
          handleCancel(); // Reset everything on success
          window.location.reload();
        } else {
          toast.error(result.message || 'Failed to upload video.');
        }
      } catch (error) {
        toast.error('Error uploading video.');
        console.error(error);
      }
    }, (err) => {
      toast.error('Unable to access location.');
      console.error(err);
    });
  };

  const handleCancel = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
    }

    // Stop webcam stream if active
    const tracks = webcamRef.current?.stream?.getTracks();
    tracks?.forEach(track => track.stop());

    setShowCamera(false);
    setRecording(false);
    setMediaRecorder(null);
    setRecordedChunks([]);
    setVideoPreviewUrl(null);
    setCaption('');
    onClose(); // Close the modal
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center' }}>Upload a Live Video</h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Category: <strong>{selectedCategory}</strong>
        </p>

        <div
          style={{
            border: '2px solid #ccc',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={!showCamera && !videoPreviewUrl ? openCamera : undefined}
        >
          {showCamera ? (
            <Webcam
              audio
              ref={webcamRef}
              videoConstraints={videoConstraints}
              style={{ width: '100%' }}
            />
          ) : videoPreviewUrl ? (
            <video src={videoPreviewUrl} controls style={{ width: '100%', borderRadius: '8px' }} />
          ) : (
            <div style={{ color: '#666' }}>
              <img
                src="https://img.icons8.com/ios/50/000000/camera--v1.png"
                alt="Open Camera"
                style={{ marginBottom: '0.5rem' }}
              />
              <div>Click to open camera</div>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Click to add caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            backgroundColor: '#eee',
            border: 'none',
            borderRadius: '4px'
          }}
        />

        {showCamera && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            {recording ? (
              <button onClick={stopRecording} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem' }}>
                Stop Recording
              </button>
            ) : (
              <button onClick={startRecording} style={{ backgroundColor: '#00e0b8', color: 'white', padding: '0.5rem 1rem' }}>
                Start Recording
              </button>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleCancel} style={{ padding: '0.5rem 1rem', border: '1px solid #ccc' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!caption || recordedChunks.length === 0}
            style={{
              backgroundColor: (!caption || recordedChunks.length === 0) ? 'gray' : '#00e0b8',
              color: 'white',
              padding: '0.5rem 1rem',
              cursor: (!caption || recordedChunks.length === 0) ? 'not-allowed' : 'pointer'
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoLiveModal;
