let pageLimit = 5;
let page = 1;
let totalData, data, totalNumOfPages, numberOfPageButtons, currentPageNumber;
let prevPageNumber, prev, next, first, last;
let pageButtons, prevPageNumId, currPageNumId, sub, topic;
let additionalButtons, currID, currQuesID;

const quesAnsSection = document.getElementById("ques-ans-section");
const pageNumberSection = document.getElementById("page-number-section");
const invalidMessage = document.getElementById("invalid-msg");
const gotoInput = document.getElementById("goto");
const submit = document.getElementById("submit");
const postUpdate = document.getElementById("post-update");

window.onload = async function () {
    console.log("hello");
    submit.addEventListener("click", addNewAnswer);
    await fetchData();
};

async function fetchData() {
    try {
        const path = decodeURI(window.location.pathname);
        const arr = path.split("/");
        const sub = arr[3];
        const topic = arr[5];

        console.log(sub, topic);

        currentPageNumber = 1;

        const dbResponse = await fetch(
            `${location.origin}/api/v1/posts/fetch?sub=${sub}&topic=${topic}&page=${currentPageNumber}&limit=${pageLimit}&answered=true`
        );

        const dbData = await dbResponse.json();

        console.log(dbData);

        ({ data, totalData } = dbData);
        console.log(data, totalData);

        if (totalData) {
            totalNumOfPages = Math.ceil(totalData / pageLimit);

            console.log("totalNumOfPages : ", totalNumOfPages);

            numberOfPageButtons = totalNumOfPages > 10 ? 10 : totalNumOfPages;

            console.log("numberOfPageButtons : ", numberOfPageButtons);

            createCurrentPageData(currentPageNumber);
            createPageNumberButtons(currentPageNumber);

            prev = document.getElementById("prev");
            last = document.getElementById("last");
            first = document.getElementById("first");
            next = document.getElementById("next");
        } else {
            quesAnsSection.innerHTML = `<p class="d-flex justify-content-center">No Question Is Available Right Now...<p>`;
            gotoInput.value = "";
        }
    } catch (error) {
        console.log(error);
    }
}

async function gotoPage(pageNumber) {
    if (isNaN(pageNumber) || pageNumber == null) return;
    if (pageNumber < 1 || pageNumber > totalNumOfPages) {
        invalidMessage.style.display = "block";
        return;
    }

    invalidMessage.style.display = "none";

    console.log(pageNumber);

    const dbResponse = await fetch(
        `${location.origin}/api/v1/posts/fetch?sub=${sub}&&topic=${topic}&&page=${pageNumber}&&limit=${pageLimit}&&answered=true`
    );

    const rawData = await dbResponse.json();
    data = rawData.data;

    if (data.length) {
        prevPageNumber = currentPageNumber;
        currentPageNumber = pageNumber;

        createCurrentPageData(pageNumber);
        createPageNumberButtons(pageNumber);
    } else {
        quesAnsSection.innerHTML = `<p class="d-flex justify-content-center">No Question Is Available Right Now...<p>`;
        gotoInput.value = "";
    }
}

function createCurrentPageData(pageNumber) {
    let index, currentPageData, eachData, ansDiv, addAnswer;
    let currentPageContainer, addNewAnsBtn;

    quesAnsSection.innerHTML = "";
    gotoInput.value = "";

    index = (pageNumber - 1) * pageLimit + 1;
    currentPageData = data;

    console.log(currentPageData, Object.entries(currentPageData[0])[3][0]);

    for (let i = 0; i < pageLimit && i < currentPageData.length; i++, index++) {
        eachQnAContainer = HTML(
            `<div class="mb-5 border border-secondary"></div>`
        );

        let questionContainer = HTML(
            `<div class="container-fluid questions">
                <h5 class="text-secondary">Question: ${index}</h5>
                <h5 id="question${index}" data-ques-id="${currentPageData[i]._id}">${currentPageData[i].question}</h5>
                <span class="text-dark fw-bold me-3 py-1 px-2 border border-dark rounded">id: ${currentPageData[i]._id}</span>
            </div>`
        );

        let answerContainer = HTML(
            `<div id="accordian${index}" class="accordion answers"></div>`
        );

        for (let j = 0; j < currentPageData[i]["answers"].length; j++) {
            let eachAnswer = HTML(`<div class="accordion-item">
                    <h2 class="accordion-header" id="q${index}a${
                j + 1
            }-heading">
                        <div class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#q${index}a${
                j + 1
            }h${j + 1}" aria-expanded="true" aria-controls="q${index}a${
                j + 1
            }h${j + 1}">Answer #${j + 1}</div>
                    </h2>
                </div>`);

            let ansBodySeg = HTML(`<div id="q${index}a${j + 1}h${
                j + 1
            }" class="accordion-collapse collapse" aria-labelledby="q${index}a${
                j + 1
            }-heading">
                    <div class="accordion-body" id="q${index}a${j + 1}">
                        <div>${currentPageData[i]["answers"][j].answer}</div>
                    </div>
                </div>`);

            eachAnswer.append(ansBodySeg);

            answerContainer.append(eachAnswer);
        }
        if (currentPageData[i]["answers"].length === 10) {
            addNewAnsBtn = HTML(
                `<button type="button" class="btn btn-outline-dark btn-sm shadow-none" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="accordian${index}" disabled>Add New Answer</button>`
            );
        } else {
            addNewAnsBtn = HTML(
                `<button type="button" class="btn btn-outline-dark btn-sm shadow-none" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="accordian${index}">Add New Answer</button>`
            );
        }
        questionContainer.append(addNewAnsBtn);

        eachQnAContainer.append(questionContainer);
        eachQnAContainer.append(answerContainer);

        quesAnsSection.append(eachQnAContainer);
    }
}

function createPageNumberButtons(pageNumber) {
    let page, startPageNo, endPageNo;

    pageNumberSection.innerHTML = "";

    pageNumber = Math.floor((pageNumber - 1) / 10);
    startPageNo = pageNumber * 10 + 1;
    endPageNo = Math.min((pageNumber + 1) * 10, totalNumOfPages);

    first = HTML(
        `<button id="first" class="btn btn-outline-dark me-1 my-1 shadow-none" onclick="gotoPage(1)">First</button>`
    );
    prev = HTML(
        `<button id="prev" class="btn btn-outline-dark me-1 my-1 shadow-none" onclick="gotoPage(${
            currentPageNumber - 1
        })">Previous</button>`
    );

    pageNumberSection.append(first);
    pageNumberSection.append(prev);

    for (let i = startPageNo; i <= endPageNo; i++) {
        page = HTML(
            `<button id="${i}" class="pages btn ${
                i == currentPageNumber ? "btn-secondary" : "btn-outline-dark"
            } me-1 my-1 shadow-none" onclick="gotoPage(${i})">${i}</button>`
        );

        pageNumberSection.append(page);
    }

    next = HTML(
        `<button id="next" class="btn btn-outline-dark me-1 my-1 shadow-none" onclick="gotoPage(${
            currentPageNumber + 1
        })">Next</button>`
    );
    last = HTML(
        `<button type="button" id="last" class="btn btn-outline-dark me-1 my-1 shadow-none" onclick="gotoPage(${totalNumOfPages})">Last</button>`
    );

    pageNumberSection.append(next);
    pageNumberSection.append(last);

    if (currentPageNumber == 1) {
        first.disabled = true;
        prev.disabled = true;
    } else {
        first.disabled = false;
        prev.disabled = false;
    }

    if (currentPageNumber == totalNumOfPages) {
        last.disabled = true;
        next.disabled = true;
    } else {
        last.disabled = false;
        next.disabled = false;
    }
}

function goBack() {
    gotoPage(currentPageNumber - 1);
}
function goNext() {
    gotoPage(currentPageNumber + 1);
}

function goto() {
    let pageNumber = parseInt(gotoInput.value);
    console.log(pageNumber);
    gotoPage(pageNumber);
}

function HTML(dom) {
    const template = document.createElement("template");
    template.innerHTML = dom;
    return template.content.firstChild;
}

// modal logics

const exampleModal = document.getElementById("exampleModal");
exampleModal.addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    let button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    let recipient = button.getAttribute("data-bs-whatever");

    console.log(recipient);

    currID = recipient.substr(9);

    let question = document.querySelector(`#question${currID}`);
    currQuesID = question.getAttribute("data-ques-id");
    console.log(currQuesID);

    document.getElementById("modal-ques-id").innerText = currQuesID;

    let modalBodyInput = exampleModal.querySelector(".modal-body textarea");

    modalBodyInput.value = question.innerText;

    const addAnswerForm = document.getElementById("addAnswerForm");
    addAnswerForm.email.value = "";
    addAnswerForm.answer.value = "";
});

async function addNewAnswer(e) {
    e.preventDefault();

    console.log("submit");

    const quesId = document.getElementById("modal-ques-id").innerText;

    const addAnswerForm = document.getElementById("addAnswerForm");

    console.log(quesId);

    const newAnswerData = new FormData(addAnswerForm);

    const formData = Object.fromEntries(newAnswerData.entries());

    formData.id = currQuesID;
    console.log(formData);
    postUpdate.innerHTML = "";

    try {
        if (!formData.answer || !formData.email)
            throw Error("Answer Couldn't Added");

        const res = await fetch(
            "http://localhost:2000/api/v1/posts/addanswer",
            {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-type": "application/json",
                },
            }
        );
        const result = HTML(`<div
                        class="d-flex align-items-center justify-content-center my-3"
                    >
                        <i class="fad fa-badge-check fa-5x"></i>
                        <span class="ms-3 fs-1 text-success"
                            >Answer Added Successfully!!!</span
                        >
                    </div>`);
        postUpdate.append(result);

        console.log("Answer updated successfully...");

        addAnswerDOM(formData.answer);
    } catch (err) {
        console.log(err);
        const result = HTML(`<div
                        class="d-flex align-items-center justify-content-center my-3"
                    >
                        <i class="fad fa-times-circle fa-5x"></i>
                        <span class="ms-3 fs-1 text-danger"
                            >Answer Not Added!!!</span
                        >
                    </div>`);
        postUpdate.append(result);
        console.log("Something Went Wrong. Try Again...");
    }

    currID = currQuesID = undefined;
}

function addAnswerDOM(answer) {
    let accordian = document.getElementById(`accordian${currID}`);

    let answerNum = accordian.children.length;

    answerNum++;

    let newAnswer = HTML(`<div class="accordion-item">
                    <h2 class="accordion-header" id="q${currID}a${answerNum}-heading">
                        <div class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#q${currID}a${answerNum}h${answerNum}" aria-expanded="true" aria-controls="q${currID}a${answerNum}h${answerNum}">Answer #${answerNum}</div>
                    </h2>
                </div>`);

    let newAnsBodySeg =
        HTML(`<div id="q${currID}a${answerNum}h${answerNum}" class="accordion-collapse collapse" aria-labelledby="q${currID}a${answerNum}-heading">
                    <div class="accordion-body" id="q${currID}a${answerNum}">
                        <div>${answer}</div>
                    </div>
                </div>`);

    newAnswer.append(newAnsBodySeg);
    accordian.append(newAnswer);

    if (accordian.children.length === 10) {
        document.querySelector(
            `#question${currID}`
        ).parentNode.children[3].disabled = "true";
    }
}
