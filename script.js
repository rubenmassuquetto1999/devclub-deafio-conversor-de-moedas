let hasConverted = false;
const convertButton = document.querySelector(".convertButton");
const currencySelectFrom = document.querySelector(".currency-select-from");
const currencySelectTo = document.querySelector(".currency-select-to");
const resultSection = document.querySelector(".result-section");
const errorMessage = document.querySelector(".error-message");
const inputField = document.querySelector("input");

const formatOptions = {
    real: { locale: "pt-BR", currency: "BRL", minFractions: 2 },
    dolar: { locale: "en-US", currency: "USD", minFractions: 2 },
    euro: { locale: "de-DE", currency: "EUR", minFractions: 2 },
    libra: { locale: "en-GB", currency: "GBP", minFractions: 2 },
    bitcoin: { locale: "pt-BR", currency: "BTC", minFractions: 5 }
};

async function cliquei() {
    const fromCurrency = currencySelectFrom.value;
    const toCurrency = currencySelectTo.value;
    const options = formatOptions[fromCurrency];
    const inputValueText = inputField.value;

    let rawValue = inputValueText.replace(/\D/g, "");
    let divisor = options.minFractions === 5 ? 100000 : 100;
    const inputValue = Number(rawValue) / divisor;

    if (inputValue === "" || inputValue == 0 || isNaN(inputValue)) {
        errorMessage.style.display = "block";
        resultSection.style.display = "none";
        return;
    } else {
        errorMessage.style.display = "none";
    }

    hasConverted = true;

    const resposta = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL");
    const dados = await resposta.json();

    const rates = {
        real: 1,
        dolar: dados.USDBRL.ask,
        euro: dados.EURBRL.ask,
        libra: dados.GBPBRL.ask,
        bitcoin: dados.BTCBRL.ask
    };

    const valueInBrl = inputValue * rates[fromCurrency];
    const convertedValue = valueInBrl / rates[toCurrency];

    const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
    const currencyValue = document.querySelector(".currency-value");

    currencyValueToConvert.innerHTML = new Intl.NumberFormat(formatOptions[fromCurrency].locale, {
        style: "currency",
        currency: formatOptions[fromCurrency].currency,
        minimumFractionDigits: formatOptions[fromCurrency].minFractions
    }).format(inputValue);

    currencyValue.innerHTML = new Intl.NumberFormat(formatOptions[toCurrency].locale, {
        style: "currency",
        currency: formatOptions[toCurrency].currency,
        minimumFractionDigits: formatOptions[toCurrency].minFractions
    }).format(convertedValue);

    resultSection.style.display = "flex";
}

function changeCurrency() {
    const currencyNames = document.querySelectorAll(".currency");
    const currencyImages = document.querySelectorAll(".imagem-moeda");

    const currencies = {
        real: { name: "Real Brasileiro", image: "./assets/real.png" },
        dolar: { name: "Dólar Americano", image: "./assets/dolar.png" },
        euro: { name: "Euro", image: "./assets/euro.png" },
        libra: { name: "Libra", image: "./assets/libra.png" },
        bitcoin: { name: "Bitcoin", image: "./assets/bitcoin.png" }
    };

    const fromCurrencyData = currencies[currencySelectFrom.value];
    const toCurrencyData = currencies[currencySelectTo.value];

    if (fromCurrencyData) {
        currencyNames[0].innerHTML = fromCurrencyData.name;
        currencyImages[0].src = fromCurrencyData.image;
    }

    if (toCurrencyData) {
        currencyNames[1].innerHTML = toCurrencyData.name;
        currencyImages[1].src = toCurrencyData.image;
    }

    const inputEvent = new Event('input');
    inputField.dispatchEvent(inputEvent);

    let rawValue = inputField.value.replace(/\D/g, "");
    if (rawValue !== "" && Number(rawValue) !== 0 && hasConverted === true) {
        cliquei();
    }
}

inputField.addEventListener("input", function (event) {
    const fromCurrency = currencySelectFrom.value;
    const options = formatOptions[fromCurrency];

    let rawValue = event.target.value.replace(/\D/g, "");

    if (rawValue === "") {
        event.target.value = "";
        return;
    }

    let divisor = options.minFractions === 5 ? 100000 : 100;
    let numericValue = Number(rawValue) / divisor;

    event.target.value = new Intl.NumberFormat(options.locale, {
        style: "currency",
        currency: options.currency,
        minimumFractionDigits: options.minFractions
    }).format(numericValue);
});

convertButton.addEventListener("click", cliquei);
currencySelectFrom.addEventListener("change", changeCurrency);
currencySelectTo.addEventListener("change", changeCurrency);

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        cliquei();
    }
});

changeCurrency();