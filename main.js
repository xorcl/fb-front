let CAPTCHA_SOLVED = false;

window.onload = function() {
    let fb_id = document.querySelector("#fb_id");
    let search_button = document.querySelector("#search");
    let loading = document.querySelector("#loading");
    let results = document.querySelector("#results");
    let error = document.querySelector("#error");
    fb_id.onchange = function() {
        let text = fb_id.value;
        id = text.replace(/https?\:\/\/(www\.)?facebook\.com\.?\//,"").replace(/[^A-Za-z0-9.]+/g, "");
        fb_id.value = id;
        if (fb_id.value.length > 0 && CAPTCHA_SOLVED) {
            search_button.disabled = false;
        } else {
            search_button.disabled = true;
        }
    }
    search_button.onclick = function() {
        results.classList.add("hidden");
        error.classList.add("hidden");   
        loading.classList.remove("hidden") 
        search_button.disabled = false; 
        let username = fb_id.value;
        let challenge = document.querySelector("[name=h-captcha-response]").value
        let formData = new FormData();
        formData.append('username', username);
        formData.append('h-captcha-response', challenge);
        fetch("https://api.fb.xor.cl/fb/user", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loading.classList.add("hidden")
            if ("error" in data) {
                error.classList.remove("hidden");
            } else {
                for (const [prop, value] of Object.entries(data.data)) {
                    let data_tr = document.querySelector(`#${prop}`)
                    let warning = data_tr.querySelector(".warning");
                    let ok = data_tr.querySelector(".ok");
                    if (value === true) {
                        warning.classList.remove("hidden")
                        ok.classList.add("hidden")
                    } else {
                        ok.classList.remove("hidden")
                        warning.classList.add("hidden")
                    }
                }
                results.classList.remove("hidden")
            }
        });
    }
}

function onCaptchaSuccess() {
    CAPTCHA_SOLVED = true
    let fb_id = document.querySelector("#fb_id")
    let search_button = document.querySelector("#search")
    if (fb_id.value.length > 0 && CAPTCHA_SOLVED) {
        search_button.disabled = false
    } else {
        search_button.disabled = true
    }
}

function onCaptchaExpired() {
    let search_button = document.querySelector("#search")
    search_button.disabled = true
}