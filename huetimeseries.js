class HueTimeSeriesDisplay {
    constructor(x, y, width = 1000, height = 360) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Find the maximum population in a single time slice
    getMaxPopulationInSlice(timeSlice) {
        let max = 1; // Avoid division by zero
        timeSlice.forEach(population => {
            if (population > max) {
                max = population;
            }
        });
        return max;
    }

    // Convert HSL to RGB for ImageData
    hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r, g, b;
        
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        
        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        ];
    }

    draw(ctx, hueTimeSeriesData) {
        if (!hueTimeSeriesData || hueTimeSeriesData.length === 0) return;

        // Create ImageData for fast pixel manipulation
        const imageData = ctx.createImageData(this.width, this.height);
        const data = imageData.data;

        // Sliding window: show most recent data that fits in width
        const maxTimeSteps = this.width; // 1 pixel per time step
        const timeSteps = Math.min(hueTimeSeriesData.length, maxTimeSteps);
        const startIndex = Math.max(0, hueTimeSeriesData.length - maxTimeSteps);
        const visibleData = hueTimeSeriesData.slice(startIndex);

        // Fill ImageData - each time step gets exactly 1 pixel
        for (let t = 0; t < timeSteps; t++) {
            const timeSlice = visibleData[t];
            const sliceMax = this.getMaxPopulationInSlice(timeSlice); // Normalize per slice
            const x = t; // Direct 1:1 mapping

            for (let hue = 0; hue < 360; hue++) {
                const population = timeSlice[hue] || 0;
                const lightness = 100 - (population / sliceMax) * 50; // Use slice max
                const [r, g, b] = this.hslToRgb(hue, 100, lightness);

                const pixelIndex = (hue * this.width + x) * 4;
                data[pixelIndex] = r;     // Red
                data[pixelIndex + 1] = g; // Green
                data[pixelIndex + 2] = b; // Blue
                data[pixelIndex + 3] = 255; // Alpha
            }
        }

        // Fill remaining space with white (when we have fewer than maxTimeSteps)
        for (let x = timeSteps; x < this.width; x++) {
            for (let hue = 0; hue < 360; hue++) {
                const pixelIndex = (hue * this.width + x) * 4;
                data[pixelIndex] = 255;     // Red
                data[pixelIndex + 1] = 255; // Green
                data[pixelIndex + 2] = 255; // Blue
                data[pixelIndex + 3] = 255; // Alpha
            }
        }

        // Draw the ImageData to canvas
        ctx.putImageData(imageData, this.x, this.y);

        // Optional: Draw border
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}