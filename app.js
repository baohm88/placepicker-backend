import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";

const app = express();

app.use(express.static("images"));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    next();
});

app.get("/places", async (req, res) => {
    // const fileContent = await fs.readFile("./data/places.json");
    // const placesData = JSON.parse(fileContent);
    // res.status(200).json({ places: placesData });
    try {
        console.log("Reading file: ./data/places.json");
        const fileContent = await fs.readFile("./data/places.json", "utf-8");
        console.log("File content:", fileContent);

        const placesData = JSON.parse(fileContent || "[]"); // Default to empty array if file is empty
        res.status(200).json({ places: placesData });
    } catch (error) {
        console.error("Error reading places.json:", error);
        res.status(500).json({ message: "Failed to fetch places." });
    }
});

app.get("/user-places", async (req, res) => {
    // const fileContent = await fs.readFile("./data/user-places.json");
    // const places = JSON.parse(fileContent);
    // res.status(200).json({ places });
    try {
        const fileContent = await fs.readFile(
            "./data/user-places.json",
            "utf-8"
        );
        const places = JSON.parse(fileContent || "[]");
        res.status(200).json({ places });
    } catch (error) {
        console.error("Error reading user-places.json:", error);
        res.status(500).json({ message: "Failed to fetch user places." });
    }
});

app.put("/user-places", async (req, res) => {
    const places = req.body.places;
    await fs.writeFile("./data/user-places.json", JSON.stringify(places));
    res.status(200).json({ message: "User places updated!" });
});

// 404
app.use((req, res, next) => {
    if (req.method === "OPTIONS") return next();
    res.status(404).json({ message: "404 - Not Found" });
});

app.listen(3000);
