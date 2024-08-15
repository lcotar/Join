let userIDs = [];
let userData = [];

function setGuestUser() {
    localStorage.removeItem('user')
    sessionStorage.setItem('user', 'guest user');
}

// checks, if all required fields are filled correctly and (if yes) makes the log in possible
async function logIn() {
    const email = document.getElementById('logInEmail').value;
    const password = document.getElementById('logInPassword').value;
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const rememberMe = rememberMeCheckbox.checked;

    await loadUserDataFromFB();
    
    let userDataCorrect = false;

    for (let i = 0; i < userData.length; i++) { // saves the user, that just logged in, in SS and LS, to keep him logged in
        if (userData[i].email == email && userData[i].password == password) {
            let userName = userData[i].name;
            localStorage.setItem('user', userIDs[i]);
            sessionStorage.setItem('username', userName);
            if (rememberMe) {
                localStorage.setItem('password', userData[i].password);
                localStorage.setItem('email', userData[i].email);
            } else {
                sessionStorage.setItem('password', userData[i].password);
                sessionStorage.setItem('email', userData[i].email);
                localStorage.removeItem('password');
                localStorage.removeItem('email');
            }
            userDataCorrect = true;
            window.location.href = 'summary.html';  // leads the user to summary.html (if logged in successfully)
            break;
        }
    }

    if (!userDataCorrect) {
        document.getElementById('wrongPassword').innerHTML = `Email address or password is incorrect`;
    }
}


async function updateCurrentUser(newUser) {
    currentUserName = newUser;
}

// sign up by posting a new user into the database
async function createNewUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    document.getElementById('passwordsDontMatchNotification').classList.add('dont-show');
    document.getElementById('emailAlreadyExistsNotification').classList.add('dont-show');

    if (password !== confirmPassword) {
        document.getElementById('password').style.border = 'solid 2px rgb(252, 3, 3)';
        document.getElementById('confirm-password').style.border = 'solid 2px rgb(252, 3, 3)';
        document.getElementById('passwordsDontMatchNotification').classList.remove('dont-show');
        return;
    } else {
        document.getElementById('password').style.border = '';
        document.getElementById('confirm-password').style.border = '';
    }

    await loadUserDataFromFB();

    if (userData.some(user => user.email === email)) {
        document.getElementById('emailAlreadyExistsNotification').classList.remove('dont-show');
        document.getElementById('email').style.border = 'solid 2px rgb(252, 3, 3)';
        return;
    } else {
        document.getElementById('email').style.border = '';
    }

    let data = {
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await postNewUser("/user", data);
        confirmRegistration();
    } catch (error) {
        console.error("Error creating user:", error);
        alert('There was an error creating the user.');
    }
}

function confirmRegistration() {
    document.getElementById('logInBtns').innerHTML = '<button class="btn-dark btn confirm-registration" style="font-size: 21px;" disabled><p>You Signed Up successfully</p></button>';
    setTimeout(function () {
        // Weiterleitung zur neuen Seite
        window.location.href = "index.html";
    }, 2000); // 3000 ms Verzögerung
}

// posts a new user into the data bank after a successfull sign up process
async function postNewUser(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

// fetches user data from firebase and pushes it into local arrays
async function loadUserDataFromFB() {
    let userResponse = await loadUserData('/user');

    if (userResponse) {
        let userKeysArray = Object.keys(userResponse);

        userKeysArray.forEach(key => {
            userIDs.push(key);
            userData.push({
                email: userResponse[key].email,
                password: userResponse[key].password,
                name: userResponse[key].name
            });
        });
    } else {
        console.error('Keine Benutzerdaten gefunden');
    }
}

// a helping function to load user data in the function above
async function loadUserData(path = "") {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJSON = await response.json();
    return responseToJSON;
}
