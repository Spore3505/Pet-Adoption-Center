document.addEventListener("DOMContentLoaded", function () {
    function updateClock() {
        const now = new Date();
        const dateTimeString = now.toLocaleString();
        const clock = document.getElementById("time");
        if (clock) {
            clock.textContent = dateTimeString;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    const submitBtn = document.getElementById("submit2");
    if (submitBtn) {
        submitBtn.onclick = function (event) {
            const animal = document.querySelector('input[name="Animal"]:checked')?.value;
            const breed = document.getElementById("Breed").value.trim();
            const age = document.getElementById("age").value;
            const getAlongChildren = document.querySelector('input[name="get along with children"]:checked')?.value;
            const getAlongDogs = document.querySelector('input[name="get along with dogs"]:checked')?.value;
            const getAlongCats = document.querySelector('input[name="get along with cats"]:checked')?.value;
            const information = document.getElementById("Information").value.trim();
            const fname = document.getElementById("fname").value.trim();
            const famname = document.getElementById("famname").value.trim();
            const email = document.getElementById("email").value.trim();

            let errorMessage = "";

            if (!animal) errorMessage += "Please select an animal (Cat or Dog).\n";
            if (!breed) errorMessage += "Please enter a breed.\n";
            if (!age) errorMessage += "Please select an age.\n";
            if (!getAlongChildren) errorMessage += "Please specify if the pet gets along with children.\n";
            if (!getAlongDogs) errorMessage += "Please specify if the pet gets along with dogs.\n";
            if (!getAlongCats) errorMessage += "Please specify if the pet gets along with cats.\n";
            if (!information) errorMessage += "Please tell us about the animal.\n";
            if (!fname) errorMessage += "Please enter the owner's first name.\n";
            if (!famname) errorMessage += "Please enter the owner's last name.\n";
            if (!email) {
                errorMessage += "Please enter the owner's email.\n";
            } else if (!validateEmail(email)) {
                errorMessage += "Please enter a valid email address.\n";
            }

            if (errorMessage) {
                event.preventDefault(); // 🚫 Block form submit only if errors
                alert("Error:\n" + errorMessage);
            }
        };
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});
