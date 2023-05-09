//require express, express router and bcrypt as shown in lecture code
const e = require("express");
const express = require("express");
const axios = require("axios");
const handlebars = require("handlebars");

const router = express.Router();
const app = express();
const userss = require("../data/users");
const orders = require("../data/orders");
const more = require("../data/more");
const { users } = require("../config/mongoCollections");

// node mailer
const nodemailer = require("nodemailer");
const Contact = require("../data/contact"); // Assuming you have a Contact model defined

router
  .route("/admin_register")
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      res.redirect("/protected");
    } else {
      res.render("adminRegister", { title: "Admin register" });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    //get data and save to database
    const user_data = req.body.usernameInput;
    const password_data = req.body.passwordInput;

    const uname = req.body.unameInput;
    const umail = req.body.umailInput;
    const umobile = req.body.umobileInput;
    const utype = req.body.operations_select;
    // res.render("userRegister", { user: data });

    console.log("user_data", user_data);
    console.log("user_type", utype);
    console.log("password_data", password_data);

    try {
      //Create a User by sending u and p.
      var registration_response = await userss.createUser(
        user_data,
        password_data,
        uname,
        umail,
        umobile,
        utype
      );
      console.log("registration_response", registration_response);

      if ("inserted_user" in registration_response) {
        res.redirect("/adminlogin");
      } else if ("user_exists" in registration_response) {
        res.status(400);
        res.render("adminlogin", {
          title: "Admin Login",
          error_msg: " User Already Exist",
        });
      } else if ("validation_error" in registration_response) {
        res.status(400);
        res.render("adminlogin", {
          title: "Admin Login",
          error_msg: registration_response.validation_error,
        });
      } else {
        res.status(500);
        res.render("adminlogin", {
          title: "Admin Login",
          error_msg: "Internal Server Error",
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

router.route("/AdminLogin").get(async (req, res) => {
  //code here for GET
  //admin login
  if (req.session.user) {
    res.redirect("/protected");
  } else {
    res.render("adminLogin", { title: "Admin login" });
  }
});
router.route("/userLogin").get(async (req, res) => {
  //code here for GET
  // user login
  if (req.session.user) {
    res.redirect("/protected");
  } else {
    res.render("users/userLogin", { title: "User login" });
  }
});

router.route("/newuserlogin").get(async (req, res) => {
  //code here for GET
  // create order
  if (req.session.user) {
    res.redirect("/protected");
  } else {
    res.render("home/landingpage", { title: "Home" });
  }
});
router.route("/").get(async (req, res) => {
  //code here for GET
  // create order
  if (req.session.user) {
    res.redirect("/protected");
  } else {
    res.render("home/dashboard", { title: "Home" });
  }
});

router.route("/createOrder").get(async (req, res) => {
  const uid = req.session.id;
  //code here for GET
  if (!req.session.user) {
    res.redirect("/protected");
  } else {
    res.render("users/createorder", { title: "create order" });
    // res.render("private", {
    //   msg: "Successfully Order created",
    // });
  }
});

router
  .route("/submitOrder")
  .get(async (req, res) => {
    //code here for GET
    //Create a User by sending u and p.

    const uid = req.session.id;

    res.redirect("private", {
      msg: "Successfully Order created",
      title: "Welcome",
      date_time: date_time,
      user: req.session.user,
    });
  })
  .post(async (req, res) => {
    //code here for POST
    //get data and save to database

    const kid = req.session.uid;

    console.log("KID", kid);
    const panelTypeInput = req.body.panelType;
    const powerInput = req.body.powerOutput;

    const quantityInput = req.body.quantity;
    const priceInput = req.body.price;
    const deliveryTimelineInput = req.body.deliveryTimeline;
    const descriptionInput = req.body.description;
    // res.render("userRegister", { user: data });

    console.log("panelTypeInput", panelTypeInput);
    console.log("powerInput", powerInput);
    console.log("priceInput", priceInput);

    //Create a User by sending u and p.
    var registration_response = await orders.createOrder(
      kid,
      panelTypeInput,
      powerInput,
      quantityInput,
      priceInput,
      deliveryTimelineInput,
      descriptionInput
    );
    console.log("registration_response: create order", registration_response);

    // res.render("userRegister", {
    //   title: "register",
    //   success_msg: "Creatd Order",
    // });

    res.render("private", {
      msg: "Successfully Order created",
      title: "Welcome",
      date_time: date_time,
      user: req.session.user,
    });
  });

router.route("/getOrders").get(async (req, res) => {
  //code here for GET
  //Create a User by sending u and p.
  var newOrder = await orders.getAllOrders();
  console.log(newOrder);
  // res.json();
  res.render("sales/userslist", { title: "create order", data: newOrder });
});

router.route("/getOpenOrders/:id").get(async (req, res) => {
  //code here for GET
  //Create a User by sending u and p.
  var id = req.params["id"];
  var query = "Order Created";

  // imageList = [];
  // imageList.push({ src: "/images/solar2.jpg", name: "flask" });
  var imageList = "/images/solar2.jpg";

  if (id == 2) {
    query = "Approved";
    imageList = "/images/approved.png";
  } else if (id == 3) {
    query = "Rejected";
    imageList = "/images/rejected.png";
  } else if (id == 4) {
    query = "InProgress";
    imageList = "/images/working.png";
  } else if (id == 5) {
    query = "Completed";
    imageList = "/images/solar_completed.jpeg";
  }
  var newOrder = await orders.getOrdersByStatus(query);
  console.log(newOrder);
  // res.json();
  res.render("sales/userslist", {
    title: "open orders",
    imageList,
    data: newOrder,
  });
});

router.route("/getOrdersById").get(async (req, res) => {
  //code here for GET
  //Create a User by sending u and p.

  var newOrder = await orders.getOrderById("64585517a8ee20bbb09b5f8e");
  console.log(newOrder);
  res.json(newOrder);
});

router.route("/orderHistory").get(async (req, res) => {
  //code here for GET
  //Create a User by sending u and p.
  const hid = req.session.uid;
  console.log("hid_id", hid);
  var orderHistory = await orders.getOrderByUserId(hid);
  console.log("hid", orderHistory);
  // res.json(orderHistory);
  res.render("users/orderhistory", { orderHistory: orderHistory });
});
router.route("/panels/:id").get(async (req, res) => {
  //code here for GET
  var order_id = req.params["id"];
  var newOrder = await orders.getOrderById(order_id);
  console.log("ad", newOrder);
  // res.json(newOrder);
  var page = "constructionCrew/approveForm";
  // var ImagePage = "/images/solar2.jpg";
  if (req.session.utype == "construction") {
    page = "constructionCrew/approveForm";
  } else if (req.session.utype == "sales") {
    page = "sales/approveForm";
  } else if (req.session.utype == "manager") {
    page = "sales/approveForm";
  }

  res.render(page, {
    data: newOrder,
    orderId: order_id,
    userType: req.body.utype,
  });
});

router.route("/getOrdersByUser").get(async (req, res) => {
  //code here for GET
  //Create a User by sending u and p.
  var newOrder = await orders.getOrderByUserId("6458513fd753026cb85f9744");
  console.log(newOrder);
  res.json(newOrder);
});

router.route("/updateOrder").post(async (req, res) => {
  //code here for GET
  //Create a User by sending u and p.

  const userid = req.session.uid;
  const orderId = req.body.orderId;
  const message = req.body.messageText;
  const status = req.body.operations_select;

  var newOrder = await orders.updateOrderProgress(
    orderId,
    status,
    message,
    userid
  );
  // console.log(newOrder);
  // res.json(newOrder);
  res.redirect("/getOrders");
});

router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET

    res.render("home/landingpage", { title: "User Register" });
  })
  .post(async (req, res) => {
    //code here for POST
    //get data and save to database
    const user_data = req.body.usernameInput;
    const password_data = req.body.passwordInput;

    const uname = req.body.unameInput;
    const umail = req.body.umailInput;
    const umobile = req.body.umobileInput;
    const utype = req.body.operations_select;
    // res.render("userRegister", { user: data });

    console.log("user_data", user_data);
    console.log("user_type", utype);
    console.log("password_data", password_data);

    try {
      //Create a User by sending u and p.
      var registration_response = await userss.createUser(
        user_data,
        password_data,
        uname,
        umail,
        umobile,
        "customer"
      );
      console.log("registration_response", registration_response);

      if ("inserted_user" in registration_response) {
        res.redirect("/newuserlogin");
      } else if ("user_exists" in registration_response) {
        res.status(400);
        res.render("home/landingpage", {
          title: "register",
          error_msg: " User Already Exist",
        });
      } else if ("validation_error" in registration_response) {
        res.status(400);
        res.render("home/landingpage", {
          title: "register",
          error_msg: registration_response.validation_error,
        });
      } else {
        res.status(500);
        res.render("home/landingpage", {
          title: "register",
          error_msg: "Internal Server Error",
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

router
  .route("/userRegister")
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      res.redirect("/protected");
    } else {
      res.render("users/userRegister", { title: "register" });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    //get data and save to database
    const user_data = req.body.usernameInput;
    const password_data = req.body.passwordInput;

    const uname = req.body.unameInput;
    const umail = req.body.umailInput;
    const umobile = req.body.umobileInput;
    const utype = req.body.operations_select;
    // res.render("userRegister", { user: data });

    console.log("user_data", user_data);
    console.log("user_type", utype);
    console.log("password_data", password_data);

    try {
      //Create a User by sending u and p.
      var registration_response = await userss.createUser(
        user_data,
        password_data,
        uname,
        umail,
        umobile,
        utype
      );
      console.log("registration_response", registration_response);

      if ("inserted_user" in registration_response) {
        res.redirect("/");
      } else if ("user_exists" in registration_response) {
        res.status(400);
        res.render("userRegister", {
          title: "register",
          error_msg: " User Already Exist",
        });
      } else if ("validation_error" in registration_response) {
        res.status(400);
        res.render("userRegister", {
          title: "register",
          error_msg: registration_response.validation_error,
        });
      } else {
        res.status(500);
        res.render("userRegister", {
          title: "register",
          error_msg: "Internal Server Error",
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

router.route("/login").post(async (req, res) => {
  //code here for POST
  //get login info, verify and then create session and redirect to private page
  //code here for POST
  //get data and save to database
  const user_data = req.body.usernameInput;
  const password_data = req.body.passwordInput;
  // res.render("userRegister", { user: data });

  console.log("user_data", user_data);
  console.log("password_data", password_data);

  try {
    //Create a User by sending u and p.
    var registration_response = await userss.checkUser(
      user_data,
      password_data
    );
    console.log("registration_response", registration_response);

    if ("authenticatedUser" in registration_response) {
      //create a session

      req.session.user = user_data;
      req.session.uid = registration_response.data._id.toString();
      req.session.utype = registration_response.data.utype.toString();
      console.log("aId", registration_response.data._id.toString());
      console.log("aId2", req.session.uid);

      res.redirect("/");
    } else if ("validation_error" in registration_response) {
      res.status(400);
      res.render("userLogin", {
        title: "login",
        error_msg: registration_response.validation_error,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.route("/protected").get(async (req, res) => {
  //code here for GET
  date_time = Date();
  const vid = req.session.uid;

  // var userDetails = await userss.getUserById(vid);
  // console.log("usertype:", userDetails.utype);

  // sales
  // construction
  // manager
  // coustomer

  console.log("kola", req.session.utype);
  if (req.session.utype == "sales") {
    console.log("hello sales");
    res.render("sales/sales_Dashboard", {
      title: "Sales",
      date_time: date_time,
      user: req.session.user,
    });
  } else if (req.session.utype == "construction") {
    // console.log("hello construction");
    res.render("constructionCrew/cc_dashboard", {
      title: "Construction",
      date_time: date_time,
      user: req.session.user,
    });
  } else if (req.session.utype == "manager") {
    // console.log("hello manager");
    res.render("OperationalManager/op_dashboard", {
      title: "Operational Manager",
      date_time: date_time,
      user: req.session.user,
    });
  } else if (req.session.utype == "customer") {
    res.render("private", {
      title: "Welcome",
      date_time: date_time,
      user: req.session.user,
    });
  } else {
    res.render("forbiddenAccess", { title: "Error" });
  }
  //check if user is logged in
  //if yes -
  // if no
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  //Destroy session
  req.session.destroy();
  res.render("logout", { title: "Logout" });
});

// Express route
router.get("/about", (req, res) => {
  res.render("home/about");
});

// // Express route
// router.get("/solarcalculator", (req, res) => {
//   res.render("home/solarcalculator");
// });

// GET route for displaying the Solar Calculator page
router.get("/solarcalculator", (req, res) => {
  res.render("home/solarcalculator");
});

// POST route for processing the form submission
router.post("/calculate", (req, res) => {
  // Retrieve the form data
  const { energyConsumption, solarEfficiency, solarRadiation } = req.body;

  // Perform the calculations
  const solarPower = energyConsumption / (solarEfficiency * solarRadiation);
  // solarPower = solarPower.toString();
  console.log(solarPower);
  // Render the result page with the calculated solar power value
  res.render("home/solarcalculator", { result: "Result: ", data: solarPower });
});

// Define the route to fetch the blog content
router.get("/solarblog", async (req, res) => {
  try {
    // Make an HTTP GET request to the blog URL
    const response = await axios.get("https://rapidapi.com/search/solar");

    // Extract the title and content from the response
    const { title, content } = more.extractBlogData(response.data);

    // Render the blog template with the data
    res.render("more/solarblog", { title, content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// news

router.get("/solarnews", async (req, res) => {
  try {
    const newsArticles = await more.fetchNewsData();
    res.render("home/solarnews", { newsArticles });
  } catch (error) {
    console.error("Error fetching solar news:", error);
    res.render("error", {
      errorMessage: "An error occurred while fetching solar news.",
    });
  }
});

// Express route
router.get("/contactus", (req, res) => {
  // Retrieve success message from session, if available
  const successMessage = req.session.successMessage;
  // Clear the success message from session
  req.session.successMessage = null;

  res.render("home/contact", { successMessage });
});

// Express route
router.get("/feedback", (req, res) => {
  // Retrieve success message from session, if available
  const successMessage = req.session.successMessage;
  // Clear the success message from session
  req.session.successMessage = null;

  res.render("home/feedback", { successMessage });
});

router.post("/submitFeedback", async (req, res) => {
  const { name, email, message } = req.body;

  // Perform validation on the form data
  if (!name || !email || !message) {
    // Handle validation error
    req.session.errorMessage = "Please fill in all the fields";
    res.redirect("/feedback");
    return;
  }

  try {
    // Save the form data to the database
    const contactId = await Contact.addContact(name, email, message);

    // Send an email notification
    const transporter = nodemailer.createTransport({
      // Configure your email service provider here
      service: "gmail",
      auth: {
        user: "charanrajkandula@gmail.com",
        pass: "Chan@2412",
      },
    });

    const mailOptions = {
      from: "your-email@example.com",
      to: "charanrajkandula@gmail.com",
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    // Set the success message in session
    req.session.successMessage =
      "Thank you for your message! We will get back to you soon.";
    res.redirect("/feedback");
  } catch (error) {
    console.error("Error processing contact form:", error);
    req.session.errorMessage =
      "An error occurred while processing the form. Please try again later.";
    res.redirect("/feedback");
  }
});

// update-status
router.route("/updateStatus").post(async (req, res) => {
  //code here post
  //get text info
  //get data and save in db
  const status_id = req.body.uid;
  const status_field = req.body.operations_select;
  const message_field = req.body.messageText;
  //const id_data = req.session.idData;

  // const hid = req.session.uid;
  console.log("hid_id", hid);
  var orderHistory = await orders.getOrderByUserId(status_id);

  try {
    var registration_response = await orders.updateStatus(
      status_id,
      status_field,
      message_field
    );

    console.log("holaaaaa", registration_response);
    res.render("users/orderhistory", { orderHistory: orderHistory });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
