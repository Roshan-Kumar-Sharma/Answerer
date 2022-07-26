let currAnswerBlock = 1;

const form = document.getElementById("addQnA");
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let data = new FormData(form);
    let formData = {
        answers: [],
    };

    for (const [name, value] of data) {
        if (name == "answers") formData["answers"].push(value);
        else {
            formData[name] = value;
        }
    }
    console.log(formData);

    const resData = await fetch("http://localhost:2000/api/v1/posts/add", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((response) => response.json())
        .catch((error) => {
            return error;
        });
    if (resData.error) {
        console.trace(resData);
        return;
    }
    console.log(resData);
    console.log(resData._id);

    // localStorage.setItem(resData._id, JSON.stringify(resData));

    location.href = `http://localhost:2000/questions/${resData._id}`;
});

console.log(addQnA);

const addAnswer = document.getElementById("add");
const delAnswer = document.getElementById("delete");

const answerBlocks = document.getElementsByClassName("answer-block");

addAnswer.addEventListener("click", addAnswerBlock);
delAnswer.addEventListener("click", delAnswerBlock);

function addAnswerBlock(e) {
    e.preventDefault();
    for (let i = 1; i < answerBlocks.length; i++) {
        if (answerBlocks[i].classList.contains("d-none")) {
            answerBlocks[i].classList.toggle("d-none");
            return;
        }
    }
}

function delAnswerBlock(e) {
    e.preventDefault();
    for (let i = answerBlocks.length - 1; i >= 1; i--) {
        if (!answerBlocks[i].classList.contains("d-none")) {
            answerBlocks[i].classList.toggle("d-none");
            answerBlocks[i].lastElementChild.value = "";
            return;
        }
    }
}
