"use client";

import { useState, useRef, useEffect } from "react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const startCamera = async () => {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not access camera. Please allow camera permissions or use file upload.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        onCapture(file);
        stopCamera();
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div style={{ marginBottom: "16px" }}>
      {errorMsg && (
        <div style={{ padding: "10px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", color: "#ef4444", fontSize: "12px", marginBottom: "10px" }}>
          {errorMsg}
        </div>
      )}

      {!streamActive ? (
        <button
          type="button"
          onClick={startCamera}
          style={{ width: "100%", background: "rgba(56, 189, 248, 0.15)", border: "1px dashed #38bdf8", color: "#38bdf8", borderRadius: "12px", padding: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
        >
          📷 Open Live Camera Stream
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "400px", borderRadius: "12px", background: "#000" }} />
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <button
              type="button"
              onClick={capturePhoto}
              style={{ flex: 1, background: "#4ade80", color: "#000", border: "none", borderRadius: "10px", padding: "10px", fontWeight: 800, cursor: "pointer" }}
            >
              📸 Capture Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}