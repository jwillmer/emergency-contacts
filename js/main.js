(function () {
    let encrypt = document.querySelector("#encrypt");
    if (encrypt !== null) {
        let encryptBtn = document.querySelector(".encrypt-form button");
        let encryptPasswordInput = document.querySelector(".encrypt-form input");
        let copyBtn = document.querySelector(".encrypted-container button");

        encryptBtn.addEventListener("click", encryptData);
        copyBtn.addEventListener("click", copyDecryptedJsonToClipboard);
        encryptPasswordInput.addEventListener("keypress", function (e) { if (e.key === "Enter") encryptData(); });
        InitJsonTemplate();
    }

    let decrypt = document.querySelector("#decrypt");
    if (decrypt !== null) {
        let decryptBtn = document.querySelector(".decrypt-form button");
        let decryptPaswordInput = document.querySelector(".decrypt-form input");
        let copyJsonBtn = document.querySelector("#copy-json");

        decryptBtn.addEventListener("click", decryptData);
        decryptPaswordInput.addEventListener("keypress", function (e) { if (e.key === "Enter") decryptData(); });
        copyJsonBtn.addEventListener("click", copyDecryptedJsonToClipboard);
    }
})();


async function getJsonContent() {
    return await (await fetch('emergency-information.json')).json();
}

async function getJsonTemplateContent() {
    return await (await fetch('emergency-information-template.json')).json();
}

async function encryptText(plainText, password) {
    return await new Promise(
        function (resolve, reject) {
            triplesec.encrypt({
                data: new triplesec.Buffer(plainText),
                key: new triplesec.Buffer(password),
                //progress_hook: function (obj) {
                //    console.log(obj);
                //}
            }, function (err, buff) {
                if (!err) {
                    return resolve(buff.toString('hex'));
                }
                else {
                    let errorElement = document.querySelector(".encrypt-form .error-message");
                    errorElement.innerHTML = "Failed due to missing password";
                    return reject(Error(err.message));;
                }
            });
        }
    );
}

async function decryptText(hex, password) {
    return await new Promise(
        function (resolve, reject) {
            triplesec.decrypt({
                data: new triplesec.Buffer(hex, "hex"),
                key: new triplesec.Buffer(password),
                //progress_hook: function (obj) {
                //    console.log(obj);
                //}
            }, function (err, buff) {
                if (!err) {
                    return resolve(buff.toString());
                }
                else return null;
            });
        }
    );
}

async function encryptData() {
    loading(true);
    let password = document.querySelector(".encrypt-form input").value;
    let jsonString = document.querySelector(".encrypt-form textarea").value;

    if (isValidJson(jsonString)) {
        let encryptedJson = await encryptText(jsonString, password);

        let container = document.querySelector(".encrypted-container");
        let contentElement = container.querySelector(".encrypted-content");
        let content = document.createTextNode(encryptedJson);
        contentElement.innerHTML = '';
        contentElement.appendChild(content);
        container.classList.remove("hide");
    } else {
        let errorElement = document.querySelector(".encrypt-form .error-message");
        errorElement.innerHTML = "Json is not valid, please fix it.";
    }
    loading(false);
}

function loading(isLoading) {
    let container = document.querySelector(".loading-container");
    if (isLoading) container.classList.remove("hide");
    else container.classList.add("hide");
}

async function decryptData() {
    loading(true);
    let encryptedJson = await getJsonContent();
    let passwordElement = document.querySelector(".decrypt-form input");
    let jsonString = await decryptText(encryptedJson.value, passwordElement.value);

    if (jsonString !== null) {
        if (isValidJson(jsonString)) {
            window.encryptedJson = jsonString;
            let json = JSON.parse(jsonString);
            displayJsonData(json);
        } else {
            let errorElement = document.querySelector(".error-message");
            errorElement.innerHTML = "Invalid JSON, fix your setup!";
        }
    } else {
        let errorElement = document.querySelector(".error-message");
        errorElement.innerHTML = "Wrong password, try again!";
        passwordElement.value = "";
    }

    loading(false);
}

function displayJsonData(json) {
    var personTemplate = document.querySelector("template.person");
    var phoneTemplate = document.querySelector("template.phone");
    var contentArea = document.querySelector("#content");

    for (let item in json.persons) {
        let person = json.persons[item];
        let personTemplateClone = document.importNode(personTemplate.content, true);
        personTemplateClone.querySelector(".name").innerText = person.name;

        for (let item in person.phone) {
            let phone = person.phone[item];
            let phoneTemplateClone = document.importNode(phoneTemplate.content, true);

            phoneTemplateClone.querySelector("a").setAttribute("href", `tel:${phone.value}`);
            phoneTemplateClone.querySelector(".type").innerText = phone.type;
            phoneTemplateClone.querySelector(".value").innerText = phone.value;

            personTemplateClone.querySelector(".phone-numbers").appendChild(phoneTemplateClone);
        }

        contentArea.appendChild(personTemplateClone);
    }

    document.querySelector(".authenticate").setAttribute("class", "hide");
    document.querySelector(".actions").classList.remove("hide");
}

function copyDecryptedJsonToClipboard() {
    let contentElement = document.querySelector(".encrypted-container .encrypted-content");
    if (contentElement != null) {
        let text = contentElement.innerText;
        navigator.clipboard.writeText(`{ "value": "${text}" }`);
    } else if (window.encryptedJson) {
        navigator.clipboard.writeText(window.encryptedJson);
    }

    alert("Copied data to clipboard!");
}

async function InitJsonTemplate() {
    let json = await getJsonTemplateContent();
    let textarea = document.querySelector(".encrypt-form textarea");
    textarea.value = JSON.stringify(json, null, 2);
}

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}