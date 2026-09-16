document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const username =
            document
                .getElementById("username")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        const message =
            document.getElementById(
                "registerMessage"
            );


        const button =
            document.getElementById(
                "registerButton"
            );


        message.innerText = "";


        // ==========================
        // VALIDATION
        // ==========================

        if (password !== confirmPassword) {

            message.innerText =
                "Passwords do not match.";

            return;
        }


        if (password.length < 6) {

            message.innerText =
                "Password must contain at least 6 characters.";

            return;
        }


        button.disabled = true;

        button.innerText =
            "Creating account...";


        try {

            const response =
                await fetch(
                    "/api/auth/register",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            username:
                                username,

                            email:
                                email,

                            password:
                                password

                        })

                    }
                );


            const result =
                await response.text();


            if (!response.ok) {

                message.innerText =
                    result ||
                    "Registration failed.";

                return;
            }


            message.classList.add(
                "success-message"
            );


            message.innerText =
                "Account created successfully. Redirecting to login...";


            setTimeout(
                function () {

                    window.location.href =
                        "login.html";

                },
                1500
            );


        } catch (error) {

            console.error(error);

            message.innerText =
                "Unable to connect to server.";

        } finally {

            button.disabled = false;

            button.innerText =
                "Create Account";

        }

    });