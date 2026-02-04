const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const loginFilePath = "./data/login.txt";
const petsFilePath = "./data/pets.txt";


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: "adopt-pets-123",
    resave: false,
    saveUninitialized: true
}));

// Home
app.get("/", (req, res) => {
    res.render("Home", { username: req.session.username });
});

// Register
app.get("/register", (req, res) => {
    res.render("Register", { message: null, username: req.session.username });
});

app.post("/register", (req, res) => {
    const { username, password } = req.body;

    let usernameValid = true;
    let passwordValid = true;

    for (let i = 0; i < username.length; i++) {
        if (!/[A-Za-z0-9]/.test(username[i])) {
            usernameValid = false;
            break;
        }
    }

    if (password.length < 4) {
        passwordValid = false;
    } else {
        let hasLetter = false, hasDigit = false;
        for (let i = 0; i < password.length; i++) {
            if (/[A-Za-z]/.test(password[i])) hasLetter = true;
            if (/\d/.test(password[i])) hasDigit = true;
        }
        if (!hasLetter || !hasDigit) passwordValid = false;
    }

    if (!usernameValid || !passwordValid) {
        return res.render("Register", { message: "Invalid username or password format.", username: null });
    }

    const users = fs.existsSync(loginFilePath)
        ? fs.readFileSync(loginFilePath, "utf-8").split("\n")
        : [];

    let usernameExists = false;
    for (let i = 0; i < users.length; i++) {
        const user = users[i].split(":")[0];
        if (user === username) {
            usernameExists = true;
            break;
        }
    }

    if (usernameExists) {
        return res.render("Register", { message: "Username already exists. Try another.", username: null });
    }

    fs.appendFileSync(loginFilePath, `${username}:${password}\n`);
    res.render("Register", { message: "Account successfully created. You may now log in.", username: null });
});

// Find 
app.get("/find", (req, res) => {
    res.render("Find_dog_or_cat", {
        username: req.session.username,
        results: null 
    });
});


app.post("/find", (req, res) => {
    const form = req.body;
    const allPets = fs.existsSync(petsFilePath)
        ? fs.readFileSync(petsFilePath, "utf-8").split("\n").filter(line => line.trim())
        : [];

    const matches = allPets.map(line => line.split(":")).filter(pet => {
        const [id, owner, animal, breed, age, gender, withKids, withDogs, withCats] = pet;


        // Filter by animal type
        if (form.Animal && animal.toLowerCase() !== form.Animal.toLowerCase()) return false;

        // Filter by breed (if not skipped)
        if (!form.BreedCheckbox && form.Breed && breed.toLowerCase() !== form.Breed.toLowerCase()) return false;

        // Filter by age
        if (form.age !== "N/A" && form.age !== age) return false;

        // Filter by gender
        if (form.Gender && form.Gender !== "N/A" && form.Gender.toLowerCase() !== gender.toLowerCase()) return false;

        // Filter by "get along with others"
        if (form.getAlong === "yes") {
            if (withKids !== "yes" || withDogs !== "yes" || withCats !== "yes") return false;
        }

        return true;
    });

    res.render("Find_dog_or_cat", {
        results: matches,
        username: req.session.username
    });
});

// Care / Contact
app.get("/cat-care", (req, res) => res.render("Cat_care", { username: req.session.username }));
app.get("/dog-care", (req, res) => res.render("Dog_Care", { username: req.session.username }));
app.get("/contact", (req, res) => res.render("Contact", { username: req.session.username }));

// Pet Giveaway – login first
app.get("/give", (req, res) => {
    if (req.session.loggedIn) {
        res.render("Pet_Giveaway", { username: req.session.username, message: null });
    } else {
        res.render("LoginPet", { message: null, username: null });
    }
});

// Handle giveaway login
app.post("/give/login", (req, res) => {
    const { username, password } = req.body;

    const users = fs.existsSync(loginFilePath)
        ? fs.readFileSync(loginFilePath, "utf-8").split("\n")
        : [];

    let success = false;
    for (let user of users) {
        const [storedUser, storedPass] = user.trim().split(":");
        if (storedUser === username && storedPass === password) {
            success = true;
            break;
        }
    }

    if (success) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect("/give");
    } else {
        res.render("LoginPet", { message: "Login failed. Try again.", username: null });
    }
});

// Handle pet form submission
app.post("/give/submit", (req, res) => {
    if (!req.session.loggedIn) return res.status(403).send("Unauthorized");

    const username = req.session.username;
    const formData = req.body;

    const existing = fs.existsSync(petsFilePath)
        ? fs.readFileSync(petsFilePath, "utf-8").split("\n").filter(line => line.trim() !== "")
        : [];

    const newId = existing.length + 1;

    const record = [
        newId,
        username,
        formData.Animal,
        formData.Breed,
        formData.age,
        formData.Gender, 
        formData["get along with children"],
        formData["get along with dogs"],
        formData["get along with cats"],
        formData.Information,
        formData.fname,
        formData.famname,
        formData.email
    ].join(":");
    

    fs.appendFileSync(petsFilePath, record + "\n");

    res.render("Pet_Giveaway", {
        username,
        message: "Pet successfully submitted!"
    });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
