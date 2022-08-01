const loadData = async () => {
    try {
        const res = await fetch("https://raw.githubusercontent.com/altkraft/for-applicants/master/frontend/titanic/passengers.json");
        const data = await res.json();
        return data;
    } catch (e) {
        return null;
    }
};

const NUM_OF_PAGES = 20;
let data = [], filtredData = [];

const createItem = ({ name, age, ticket, gender, survived }) => {
    const tr = document.createElement("tr");
    const genderImg = document.createElement("img");
    const tdName = document.createElement("td");
    const tdAge = document.createElement("td");
    const tdTicket = document.createElement("td");
    const tdGender = document.createElement("td");
    const tdSurvived = document.createElement("td");
    tdName.innerText = name;
    tdAge.innerText = age;
    tdTicket.innerText = ticket;
    genderImg.src = `img/${gender == "male" ? "" : "fe"}male.svg`;
    tdGender.append(genderImg);
    tdSurvived.innerText = survived ? "Да" : "Нет";
    tr.append(tdName, tdAge, tdTicket, tdSurvived, tdGender);
    return tr;
};

addEventListener("load", () => {

    let isLocked = false, currentIndex = 0;

    const main = document.querySelector("main");
    const nameInput = document.getElementById("nameInput");
    const ageInput = document.getElementById("ageInput");
    const ticketInput = document.getElementById("ticketInput");
    const sexInput = document.getElementById("sexInput");
    const isSurvivedInput = document.getElementById("isSurvivedInput");
    const tableBody = document.querySelector("tbody");

    const applyFilters = () => {
        main.scroll({top: 0, left: 0, behavior: "auto"});
        filtredData = data.filter(item => {
            if (nameInput.value != "" && !item.name.toLowerCase().includes(nameInput.value.toLowerCase())) return false;
            if (ageInput.value != "" && item.age != ageInput.value) return false;
            if (sexInput.value != "default" && item.gender != sexInput.value) return false;
            if (isSurvivedInput.value != "default" && item.survived?.toString() != isSurvivedInput.value) return false;
            if (ticketInput.value != "" && item.ticket != ticketInput.value) return false;
            return true;
        });
        tableBody.replaceChildren(...filtredData.filter((_, index) => index < NUM_OF_PAGES).map(createItem));
        currentIndex = 1;
    };

    const clearFilters = () => {
        nameInput.value = "";
        ageInput.value = "";
        ticketInput.value = "";
        sexInput.value = "default";
        isSurvivedInput.value = "default";
        applyFilters();
    };

    const [confirmButton, clearButton] = document.querySelectorAll("header > button");

    confirmButton.addEventListener("click", applyFilters);
    clearButton.addEventListener("click", clearFilters);

    main.addEventListener("scroll", e => {
        if (isLocked || tableBody.children.length == filtredData.length) return;
        if (e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop < 20) {
            isLocked = true;
            tableBody.append(...filtredData.filter((_, index) => index >= currentIndex * NUM_OF_PAGES && index < NUM_OF_PAGES * (currentIndex + 1)).map(createItem));
            currentIndex += 1;
            isLocked = false;
        }
    });

    loadData().then(v => {
        if (!v) {
            alert("Ошибка при загрузке списка пассажиров Титаника");
            return;
        }
        data = v;
        applyFilters();
    });
});