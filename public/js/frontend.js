const login = document.querySelector(".login");
const signup = document.querySelector(".signup");
const bookPlan = document.querySelector(".bookplan");
var stripe = Stripe('pk_test_tgRpta7yRZz9Q59kHKXcZSES00jBp3Kllo');
// const uploadplanimage = document.querySelector(".updatePlanImage");
async function sendLogin(email, password) {
    const answer = await axios.post("/api/users/login", { email, password });
    if (answer.data.succ) {
        alert("user logged in");
        location.assign("/me");
    } else {
        alert("something went wrong");
    }
}

async function sendsignup(name, email, password, confirmpassword, phone) {
    const response = await axios.post("/api/users/signup", { name, email, password, confirmpassword, phone });
    if (response.data.succ) {
        alert("user signed in");
    }
    else {
        alert("something went wrong");
    }
}



// async function addFormdata(form) {
//     const button = document.querySelector(".updatebtn");
//     const id = button.getAttribute("Planid");
//     const response = await axios.patch(`/api/plans/${id}`, form);
//     if (response.data.succ) {
//         alert("Plan Successfully uploaded");
//     }
//     else{
//         alert("something went wrong");
//     }
// }

if (login) {
    login.addEventListener("submit", function (event) {
        event.preventDefault();
        const inputarr = document.getElementsByTagName("input");
        const email = inputarr[0].value;
        const password = inputarr[1].value;
        sendLogin(email, password);
    })
}

if (signup) {
    signup.addEventListener("submit", function (event) {
        event.preventDefault();
        const inputarr = document.getElementsByTagName("input");
        const name = inputarr[0].value;
        const email = inputarr[1].value;
        const password = inputarr[2].value;
        const confirmpassword = inputarr[3].value;
        const phone = inputarr[4].value;
        sendsignup(name, email, password, confirmpassword, phone);
    })
}

// if (uploadplanimage) {
//     uploadplanimage.addEventListener("submit", function (event) {
//         event.preventDefault();
//         const form = new FormData();
//         const inputs = document.getElementsByTagName("input");
//         form.append("cover", inputs[0].files[0]);
//         for (var i = 1; i < inputs.length; i++) {
//             form.append("picture", inputs[i].files[0]);
//         }
//         addFormdata(form);

//     })
// }

if(bookPlan){
    bookPlan.addEventListener("click",async function(event){
        event.preventDefault();
        const planId = bookPlan.getAttribute("planId");
        // const userId = bookPlan.getAttribute("userId");
        const response = await axios.get("/api/booking/"+planId);
        const session = response.data.session;
        // console.log(session);

        stripe.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: session.id
          })
          .then(async function (result) {
            //   console.log(result);
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
            
          });

    })
}