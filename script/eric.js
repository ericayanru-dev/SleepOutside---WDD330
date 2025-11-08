const countdown = document.querySelector("#countdown");
const startButton = document.querySelector("#startButton");

let timeLeft = 10;

startButton.addEventListener("click", () => {
    setInterval(() => {
        if (timeLeft >= 0) {
            countdown.textContent = timeLeft;
            timeLeft--;
        }
        else {
            countdown.textContent = "Time's up!"; 
            console.log("That's all");
        }
    },
        1000
    )
})