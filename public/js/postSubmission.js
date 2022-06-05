const quesAnsSection = document.getElementById("ques-ans-section");
const mainDiv = document.getElementById("main");

async function renderPage() {
    const id = location.pathname.split("/")[2];
    let post;

    try {
        post = await fetch(`http://localhost:2000/api/v1/posts/${id}`);
        post = await post.json();
    } catch (error) {
        console.log(post);
    }

    console.log(post);

    if (!Array.isArray(post)) {
        mainDiv.innerHTML = `<div class="fs-1 my-5">No Question Found!!!</div>`;
        return;
    }

    quesAnsSection.innerHTML = "";

    let eachQnAContainer = HTML(
        `<div class="mb-5 border border-secondary"></div>`
    );

    let index = 0;
    let questionContainer = HTML(
        `<div class="container-fluid questions" id="question${index}">
                <h5 class="text-secondary">Question ID : ${post[0]._id}</h5>
                <h5>${post[index].question}</h5>
            </div>`
    );

    let answerContainer = HTML(`<div class="accordion answers"></div>`);

    for (let j = 0; j < post[0].answers.length; j++) {
        let eachAnswer = HTML(`<div class="accordion-item">
                    <h2 class="accordion-header" id="q${index}a${
            j + 1
        }-heading">
                        <div class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#q${index}a${
            j + 1
        }h${j + 1}" aria-expanded="true" aria-controls="q${index}a${j + 1}h${
            j + 1
        }">Answer #${j + 1}</div>
                    </h2>
                </div>`);

        let ansBodySeg = HTML(`<div id="q${index}a${j + 1}h${
            j + 1
        }" class="accordion-collapse collapse" aria-labelledby="q${index}a${
            j + 1
        }-heading">
                    <div class="accordion-body" id="q${index}a${j + 1}">
                        <div>${post[0].answers[j]}</div>
                    </div>
                </div>`);

        eachAnswer.append(ansBodySeg);

        answerContainer.append(eachAnswer);
    }

    eachQnAContainer.append(questionContainer);
    eachQnAContainer.append(answerContainer);

    quesAnsSection.append(eachQnAContainer);
}

renderPage();

function HTML(dom) {
    const template = document.createElement("template");
    template.innerHTML = dom;
    return template.content.firstChild;
}
