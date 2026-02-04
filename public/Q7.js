function updateClock() {
    const now = new Date(); 
    const dateTimeString = now.toLocaleString(); 
    document.getElementById("time").textContent = dateTimeString;
}

setInterval(updateClock, 1000);

updateClock();

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit1").onclick = function (event) {
        
        event.preventDefault();

        
        const animal = document.querySelector('input[name="Animal"]:checked')?.value;
        const breed = document.getElementById("Breed").value.trim();
        const age = document.getElementById("age").value;
        const gender = document.querySelector('input[name="Gender"]:checked')?.value;
        const getAlong = document.querySelector('input[name="get along"]:checked')?.value;

        
        let errorMessage = "";

        if (!animal) {
            errorMessage += "Please select an animal (Cat or Dog).\n";
        }
        if (!breed) {
            errorMessage += "Please enter a breed.\n";
        }
        if (!age) {
            errorMessage += "Please select an age.\n";
        }
        if (!gender) {
            errorMessage += "Please select a gender.\n";
        }
        if (!getAlong) {
            errorMessage += "Please specify if the pet needs to get along with children or other animals.\n";
        }

        
        if (errorMessage) {
            alert("Error:\n" + errorMessage); 
        } else {
            console.log("Animal:", animal);
            console.log("Breed:", breed);
            console.log("Age:", age);
            console.log("Gender:", gender);
            console.log("Get Along:", getAlong);

        }
    };
});