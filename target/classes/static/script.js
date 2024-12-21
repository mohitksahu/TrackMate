// Teachable Machine Model URL
const URL = "https://teachablemachine.withgoogle.com/models/Gmm3UbROo/";
const API_URL = "http://localhost:8080/api/items";

let model, webcam, maxPredictions;
let currentLabel = ""; // Tracks the current label
let labelCounts = {
    "Apple": 0,
    "Orange": 0,
    "Banana": 0,
    "Watermelon": 0,
    "Strawberry": 0,
    "Tender Coconut": 0
};

// Initialize the model and webcam
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Set up the webcam
        const flip = true;
        webcam = new tmImage.Webcam(500, 375, flip); // Updated size
        await webcam.setup();
        webcam.play(); // Start webcam
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        // Start prediction loop
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error("Error initializing webcam or model:", error);
    }
}

// Real-time prediction loop
async function loop() {
    try {
        webcam.update(); // Update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error("Error during the loop execution:", error);
    }
}

// Run predictions and update labels and counts
// Run predictions and update labels and counts// Run predictions and update labels and counts
async function predict() {
    try {
        const predictions = await model.predict(webcam.canvas);

        let highestProbability = 0;
        let label = "";

        predictions.forEach(prediction => {
            if (prediction.probability > highestProbability) {
                highestProbability = prediction.probability;
                label = prediction.className;
            }
        });

        const normalizedLabel = label
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        if (normalizedLabel !== currentLabel) {
            currentLabel = normalizedLabel;
            document.getElementById("label-display").textContent = currentLabel;

            if (labelCounts[currentLabel] !== undefined) {
                labelCounts[currentLabel]++;
                const id = currentLabel === "Tender Coconut" ? "count-Tender-Coconut" : `count-${currentLabel}`;
                document.getElementById(id).textContent = labelCounts[currentLabel];

                // Update the backend
                await updateItemCount(currentLabel);
            }
        }
    } catch (error) {
        console.error("Error during prediction:", error);
    }
}


async function fetchItems() {
    const response = await fetch(API_URL);
    const items = await response.json();
    console.log(items);
    // Update your table UI here based on fetched items
}

async function updateItemCount(label) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: label, count: 1 })
    });
    const item = await response.json();
    console.log(item);
    // Update your table row dynamically
}

async function fetchSavedItems() {
    try {
        const response = await fetch("http://localhost:8080/api/items");
        const items = await response.json();
        console.log(items); // Debugging: log fetched items
        // Optionally update your table UI with the fetched items
    } catch (error) {
        console.error("Error fetching saved items:", error);
    }
}
