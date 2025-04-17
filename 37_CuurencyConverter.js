const BASE_URL = "https://api.currencyapi.com/v3/latest";
const API_KEY = "cur_live_rbvuDd0MZ23FCpi3vB9ZsT0O13DfGeb33D2CLNbV";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const amountInput = document.querySelector(".amount input");
const resultMsg = document.querySelector(".msg"); // Make sure you have an element with class "msg" in your HTML

// Populate dropdowns with currency options
for(let select of dropdowns) {
    for(currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if(select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag image based on selected currency
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Handle conversion button click
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amtVal = parseFloat(amountInput.value);
    
    if(isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
    }
    
    // Construct proper API URL with parameters
    const URL = `${BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurr.value}`;
    
    try {
        let response = await fetch(URL);
        
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();
        
        // Check if the target currency exists in the response
        if(data.data && data.data[toCurr.value]) {
            const rate = data.data[toCurr.value].value;
            const finalAmount = (amtVal * rate).toFixed(2);
            
            // Display the result
            resultMsg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } else {
            resultMsg.innerText = "Currency conversion rate not available";
        }
    } catch(error) {
        console.error("Error fetching currency data:", error);
        resultMsg.innerText = "Error fetching conversion rates. Please try again.";
    }
});