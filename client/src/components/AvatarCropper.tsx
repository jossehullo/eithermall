// client/src/components/AvatarCropper.tsx
'use client';

import { useRef, useState, useEffect } from 'react';

interface AvatarCropperProps {
  image: string; // data URL
  onCancel: () => void;
  onCropped: (file: File, previewUrl: string) => void;
}

export default function AvatarCropper({
  image,
  onCancel,
  onCropped,
}: AvatarCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [aspect, setAspect] = useState(1); // To handle non-square images

  // Load image and set initial zoom to fit
  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      imageRef.current = img;
      const minSide = Math.min(img.width, img.height);
      const initialZoom = 320 / minSide; // Fit to canvas size
      setZoom(initialZoom);
      setPosition({ x: 0, y: 0 });
      setAspect(img.width / img.height);
      drawCanvas();
    };
  }, [image]);

  // Draw on canvas
  const drawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const size = 320;
    ctx.clearRect(0, 0, size, size);

    const scaledWidth = size * zoom * aspect;
    const scaledHeight = (size * zoom) / aspect;
    const dx = (size - scaledWidth) / 2 + position.x;
    const dy = (size - scaledHeight) / 2 + position.y;

    ctx.drawImage(imageRef.current, dx, dy, scaledWidth, scaledHeight);
  };

  useEffect(drawCanvas, [zoom, position, aspect]);

  // Drag handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartPosition({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    let newX = clientX - startPosition.x;
    let newY = clientY - startPosition.y;
    // Clamp position to prevent going out of bounds
    newX = Math.max(Math.min(newX, 160), -160);
    newY = Math.max(Math.min(newY, 160), -160);
    setPosition({ x: newX, y: newY });
  };

  const handleEnd = () => {
    setDragging(false);
  };

  // Crop on done
  const handleDone = () => {
    if (!imageRef.current) return;
    setSaving(true);

    const cropSize = 200;
    const canvas = document.createElement('canvas');
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext('2d')!;

    const sourceSize = Math.min(imageRef.current.width, imageRef.current.height) / zoom;
    const sourceX = (imageRef.current.width - sourceSize) / 2 - position.x / zoom;
    const sourceY = (imageRef.current.height - sourceSize) / 2 - position.y / zoom;

    ctx.drawImage(
      imageRef.current,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      cropSize,
      cropSize
    );

    canvas.toBlob(
      blob => {
        if (blob) {
          const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
          const previewUrl = URL.createObjectURL(blob);
          onCropped(file, previewUrl);
        }
        setSaving(false);
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/90 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-white mb-6">Adjust your avatar</h2>
      <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl bg-gray-800">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="absolute inset-0 cursor-move touch-pan-y touch-pan-x"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_200px_rgba(0,0,0,0.6)] pointer-events-none" />
      </div>
      <div className="mt-8 w-80 flex items-center gap-4 px-4">
        <span className="text-white text-sm">Zoom</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className="flex-1 h-2 accent-white"
        />
      </div>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-8 z-[999999]">
        <button
          onClick={onCancel}
          className="px-12 py-5 bg-white text-black text-lg font-bold rounded-full shadow-2xl hover:bg-gray-200 active:scale-95 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDone}
          disabled={saving}
          className="px-12 py-5 bg-green-600 text-white text-lg font-bold rounded-full shadow-2xl hover:bg-green-700 disabled:opacity-60 active:scale-95 transition"
        >
          {saving ? 'Saving...' : 'Done'}
        </button>
      </div>
    </div>
  );
}
