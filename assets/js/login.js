const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = form.email.value;
    let password = form.password.value;
    login(email, password);
} );

function login(email, password) {
    // vérifier les paramêtres
    fetch("http://localhost:5678/api/users/login", {
        method: 'post',
        body: {
            email : email,
            password: password
        }
    })
    .then(res =>{
        console.log(res)
        return res.json()
    })
    .then(data => {
        console.log(data);
        // ici tu recupère ton token
    })
    .catch(err =>{
        console.log(err)
    })

}