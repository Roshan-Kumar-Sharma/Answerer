let pageLimit = 5;
let page = 1;
let totalData, data, totalNumOfPages, numberOfPageButtons, currentPageNumber;
let prevPageNumber, prev, next, first, last;
let pageButtons, prevPageNumId, currPageNumId, sub, topic;
let additionalButtons;

const quesAnsSection = document.getElementById("ques-ans-section");
const pageNumberSection = document.getElementById("page-number-section");
const invalidMessage = document.getElementById("invalid-msg");
const gotoInput = document.getElementById("goto");

window.onload = async function () {
    console.log("hello");
    await fetchData();
};

async function fetchData() {
    try {
        // sub = document.getElementById("subject").innerText.trim();
        // topic = document.getElementById("topic").innerText.trim();
        sub = "dbms";
        topic = "Entity Relationship Model";

        currentPageNumber = 1;

        // const dbResponse = await fetch(
        //     `${location.origin}/api/v1/posts/fetch?sub=${sub}&&topic=${topic}&&page=${currentPageNumber}&&limit=${pageLimit}`
        // );

        // const dbData = await dbResponse.json();

        // console.log(dbData);

        // ({ data, totalData } = dbData);
        // console.log(data, totalData);

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        );
        data = await response.json();
        totalData = data.length;

        console.log(data);

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

        // pageButtons = document.getElementsByClassName("pages");

        // console.log(pageButtons);

        // pageButtons[currentPageNumber - 1].classList.toggle("btn-secondary");
        // pageButtons[currentPageNumber - 1].classList.toggle("btn-outline-dark");
    } catch (error) {
        console.log(error);
    }
}

function gotoPage(pageNumber) {
    if (isNaN(pageNumber) || pageNumber == null) return;
    if (pageNumber < 1 || pageNumber > totalNumOfPages) {
        invalidMessage.style.display = "block";
        return;
    }

    invalidMessage.style.display = "none";

    console.log(pageNumber);

    // const dbResponse = await fetch(
    //     `${location.origin}/api/v1/posts/fetch?sub=${sub}&&topic=${topic}&&page=${pageNumber}&&limit=${pageLimit}`
    // );

    // const rawData = await dbResponse.json();
    // data = rawData.data;

    // prevPageNumber = currentPageNumber;
    currentPageNumber = pageNumber;

    // // createCurrentPageData(pageNumber);
    createPageNumberButtons(pageNumber);
}

function createCurrentPageData(pageNumber) {
    // currentPageNumber = pageNumber;
    // const currentPageData = data.slice(
    //     (currentPageNumber - 1) * pageLimit,
    //     pageLimit * currentPageNumber
    // );
    let index, currentPageData, eachData, ansDiv, addAnswer;
    let currentPageContainer, addNewAnsBtn;

    quesAnsSection.innerHTML = "";

    index = (pageNumber - 1) * pageLimit + 1;
    currentPageData = data;

    console.log(currentPageData, Object.entries(currentPageData[0])[3][0]);

    for (let i = 0; i < pageLimit && i < currentPageData.length; i++, index++) {
        eachQnAContainer = HTML(
            `<div class="mb-5 border border-secondary"></div>`
        );

        let questionContainer = HTML(
            `<div class="container-fluid questions" id="question${index}">
                <h5 class="text-secondary">Question: ${index}</h5>
                <h5>${currentPageData[i].body}</h5>
                <span class="text-dark fw-bold me-3 py-1 px-2 border border-dark rounded">id: ${
                    i + 1
                }</span>
                <button type="button" class="btn btn-outline-dark btn-sm shadow-none me-1">Recommend Answer</button>
            </div>`
        );

        let answerContainer = HTML(`<div class="accordion answers"></div>`);

        if (false) {
            answerContainer.innerText =
                "No Answer Available For This Question Right Now...";
        } else {
            for (
                let j = 0;
                j < Object.entries(currentPageData[i])[3].length;
                j++
            ) {
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
                        <div>${Object.entries(currentPageData[i])[3][j]}</div>
                        <div>
                            <button class="me-2 mt-2 btn btn-sm btn-outline-info">Report</button>
                            <button class="me-2 mt-2 btn btn-sm btn-outline-info">Like</button>
                            <button class="me-2 mt-2 btn btn-sm btn-outline-info">Dislike</button>
                        </div>
                    </div>
                </div>`);

                eachAnswer.append(ansBodySeg);

                answerContainer.append(eachAnswer);
            }
            if (Object.entries(currentPageData[i])[3].length === 3) {
                addNewAnsBtn = HTML(
                    `<button type="button" class="btn btn-outline-dark btn-sm" disabled>Add New Answer</button>`
                );
            } else {
                addNewAnsBtn = HTML(
                    `<button type="button" class="btn btn-outline-dark btn-sm shadow-none">Add New Answer</button>`
                );
            }
            questionContainer.append(addNewAnsBtn);
        }

        eachQnAContainer.append(questionContainer);
        eachQnAContainer.append(answerContainer);

        quesAnsSection.append(eachQnAContainer);
    }
}

// function updateCurrentPageData(pageNumber) {
//     // currentPageNumber = pageNumber;
//     const currentPageData = data.slice(
//         (currentPageNumber - 1) * pageLimit,
//         pageLimit * currentPageNumber
//     );
//     // console.log("currentPageData : ", currentPageData.length);
//     pageDataContainer.innerHTML = "";
//     let eachData;
//     for (let i = 0; i < pageLimit && i < currentPageData.length; i++) {
//         eachData = HTML(
//             `<div class="data">
//                 <div id=${currentPageData[i].id} class="question">
//                     <h3>
//                         Q.${currentPageData[i].id})&nbsp;${currentPageData[i].title}
//                     </h3>
//                 </div>
//                 <div id=${currentPageData[i].id} class="answer"><b>Answer : </b>${currentPageData[i].body}</div>
//             </div>`
//         );
//         pageDataContainer.append(eachData);
//     }
// }

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
        // page.addEventListener("click", function () {
        //     console.log("you clicked button : ", parseInt(this.innerText));
        //     gotoPage(parseInt(this.innerText));
        // });
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
