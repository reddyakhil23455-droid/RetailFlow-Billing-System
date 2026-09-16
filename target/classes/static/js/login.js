document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const username =
            document
                .getElementById("username")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const message =
            document.getElementById(
                "loginMessage"
            );


        const button =
            document.getElementById(
                "loginButton"
            );


        message.innerText = "";


        button.disabled = true;

        button.innerText =
            "Logging in...";


        try {

            const response =
                await fetch(
                    "/api/auth/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            username:
                                username,

                            password:
                                password

                        })

                    }
                );


            const text =
                await response.text();


            if (!response.ok) {

                message.innerText =
                    text ||
                    "Invalid username or password.";

                return;

            }


            /*
             * Try to read JSON.
             * If backend returns plain text,
             * don't crash the page.
             */

            let user;


            try {

                user =
                    JSON.parse(text);

            } catch {

                user = {

                    username:
                        username,

                    role:
                        "USER"

                };

            }


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            message.innerText =
                "Unable to connect to the server.";

        } finally {

            button.disabled = false;

            button.innerText =
                "Login";

        }

    });