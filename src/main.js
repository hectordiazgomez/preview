import React, { useState, useEffect, useRef } from 'react';

const Main = () => {
    const [mainColor, setMainColor] = useState('#ff0000');
    const [gradientDirection, setGradientDirection] = useState('to bottom');
    const [intensity, setIntensity] = useState(50);
    const [image, setImage] = useState(null);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
    const [text, setText] = useState('');
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const [isTextDragging, setIsTextDragging] = useState(false);
    const [textStartDragPosition, setTextStartDragPosition] = useState({ x: 0, y: 0 });
    const [fontSize, setFontSize] = useState('16px');
    const [fontType, setFontType] = useState('Arial');
    const [textColor, setTextColor] = useState('#000000');
    const previewRef = useRef(null);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const updatePreview = () => {
        const rgb = hexToRgb(mainColor);
        const startColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        const endColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - intensity / 100})`;
        return `linear-gradient(${gradientDirection}, ${startColor}, ${endColor})`;
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.substr(0, 5) === "image") {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setImagePosition({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (image) {
            const img = new Image();
            img.onload = () => {
                const previewWidth = previewRef.current.offsetWidth;
                const previewHeight = previewRef.current.offsetHeight;
                const imgAspectRatio = img.width / img.height;
                const previewAspectRatio = previewWidth / previewHeight;

                let newWidth, newHeight;
                if (imgAspectRatio > previewAspectRatio) {
                    newWidth = previewWidth;
                    newHeight = newWidth / imgAspectRatio;
                } else {
                    newHeight = previewHeight;
                    newWidth = newHeight * imgAspectRatio;
                }

                setImageSize({ width: newWidth, height: newHeight });
            };
            img.src = image;
        }
    }, [image]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartDragPosition({
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - startDragPosition.x;
            const newY = e.clientY - startDragPosition.y;
            setImagePosition({ x: newX, y: newY });
        }
        if (isTextDragging) {
            const newX = e.clientX - textStartDragPosition.x;
            const newY = e.clientY - textStartDragPosition.y;
            setTextPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsTextDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const scaleChange = e.deltaY * -0.01;
        const newWidth = imageSize.width * (1 + scaleChange);
        const newHeight = imageSize.height * (1 + scaleChange);
        setImageSize({ width: newWidth, height: newHeight });
    };

    const handleTextMouseDown = (e) => {
        setIsTextDragging(true);
        setTextStartDragPosition({
            x: e.clientX - textPosition.x,
            y: e.clientY - textPosition.y
        });
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Unable to get 2D context');
            return;
        }

        const preview = previewRef.current;
        if (!preview) {
            console.error('Preview element not found');
            return;
        }

        canvas.width = preview.offsetWidth;
        canvas.height = preview.offsetHeight;

        const gradient = ctx.createLinearGradient(0, 0,
            gradientDirection.includes('right') ? canvas.width : 0,
            gradientDirection.includes('bottom') ? canvas.height : 0
        );
        const rgb = hexToRgb(mainColor);
        gradient.addColorStop(0, `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - intensity / 100})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (image) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, imagePosition.x, imagePosition.y, imageSize.width, imageSize.height);
                drawText(ctx);
                downloadImage(canvas);
            };
            img.onerror = () => {
                console.error('Error loading image');
                drawText(ctx);
                downloadImage(canvas);
            };
            img.src = image;
        } else {
            drawText(ctx);
            downloadImage(canvas);
        }
    };

    const drawText = (ctx) => {
        ctx.font = `${fontSize} ${fontType}`;
        ctx.fillStyle = textColor;
        ctx.fillText(text, textPosition.x, textPosition.y);
    };


    const downloadImage = (canvas) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Unable to create blob');
                return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'custom-background.png';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - HEADER_HEIGHT)',
            backgroundColor: '#f0f0f0',
            padding: '20px'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                paddingTop: '24px',
                paddingBottom: '24px',
                paddingLeft: '20px',
                paddingRight: '20px',
                width: '80%',
                maxWidth: '1200px',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap' 
                }}>
                    <div style={{
                        flex: '1 1 300px', 
                        marginRight: '20px',
                        marginBottom: '20px'
}}>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="mainColor" style={{ display: 'block', marginBottom: '5px' }}>Main Color:</label>
                            <input
                                type="color"
                                id="mainColor"
                                value={mainColor}
                                onChange={(e) => setMainColor(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="gradientDirection" style={{ display: 'block', marginBottom: '5px' }}>Gradient Direction:</label>
                            <select
                                id="gradientDirection"
                                value={gradientDirection}
                                onChange={(e) => setGradientDirection(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            >
                                <option value="to bottom">Top to Bottom</option>
                                <option value="to top">Bottom to Top</option>
                                <option value="to right">Left to Right</option>
                                <option value="to left">Right to Left</option>
                                <option value="to bottom right">Top-Left to Bottom-Right</option>
                                <option value="to top left">Bottom-Right to Top-Left</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="intensity" style={{ display: 'block', marginBottom: '5px' }}>Intensity:</label>
                            <input
                                type="range"
                                id="intensity"
                                min="0"
                                max="100"
                                value={intensity}
                                onChange={(e) => setIntensity(Number(e.target.value))}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="imageUpload" style={{ display: 'block', marginBottom: '5px' }}>Upload Image:</label>
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="text" style={{ display: 'block', marginBottom: '5px' }}>Text:</label>
                            <input
                                type="text"
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="textColor" style={{ display: 'block', marginBottom: '5px' }}>Text Color:</label>
                            <input
                                type="color"
                                id="textColor"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="fontSize" style={{ display: 'block', marginBottom: '5px' }}>Font Size:</label>
                            <select
                                id="fontSize"
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            >
                                <option value="12px">12px</option>
                                <option value="14px">14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                                <option value="20px">20px</option>
                                <option value="24px">24px</option>
                                <option value="28px">28px</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="fontType" style={{ display: 'block', marginBottom: '5px' }}>Font Type:</label>
                            <select
                                id="fontType"
                                value={fontType}
                                onChange={(e) => setFontType(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            >
                                <option value="Arial">Arial</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Georgia">Georgia</option>
                            </select>
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button onClick={saveImage} style={{
                                padding: '10px 20px',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#007BFF',
                                color: 'white',
                                cursor: 'pointer'
                            }}>Save Image</button>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: '1 1 auto',
                        minWidth: '300px', 
                    }}>
                        <div
                            ref={previewRef}
                            style={{
                                flex: '1',
                                width: "300px", 
                                height: '550px', 
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                                background: updatePreview(),
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onWheel={handleWheel}
                        >
                            {image && (
                                <div
                                    ref={imageRef}
                                    style={{
                                        position: 'absolute',
                                        left: `${imagePosition.x}px`,
                                        top: `${imagePosition.y}px`,
                                        width: `${imageSize.width}px`,
                                        height: `${imageSize.height}px`,
                                        cursor: 'move'
                                    }}
                                    onMouseDown={handleMouseDown}
                                >
                                    <img
                                        src={image}
                                        alt="Uploaded preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        draggable={false}
                                    />
                                </div>
                            )}
                            {text && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: `${textPosition.x}px`,
                                        top: `${textPosition.y}px`,
                                        cursor: 'move',
                                        fontSize: fontSize,
                                        fontFamily: fontType,
                                        color: textColor
                                    }}
                                    onMouseDown={handleTextMouseDown}
                                >
                                    {text}
                                </div>
                            )}
                        </div>
</div>
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </div>
    );
};

export default Main;
