//require express, express router and bcrypt as shown in lecture code
const e = require("express");
const express = require("express");
const router = express.Router();
const userss = require("../data/users");
const orders = require("../data/orders");
const { users } = require("../config/mongoCollections");

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

router.route("/").get(async (req, res) => {
  //code here for GET
  // create order
  if (req.session.user) {
    res.redirect("/protected");
  } else {
    res.render("home/landingpage", { title: "Home" });
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
  //Create a User by sending u and p.

  var user_id = req.params["id"];
  var newOrder = await orders.getOrderById(user_id);
  console.log(newOrder);
  // res.json(newOrder);
  res.render("sales/approveForm", { data: newOrder });
});

router.route("/getOrdersByUser").get(async (req, res) => {
  //code here for GET
  //Create a User by sending u and p.
  var newOrder = await orders.getOrderByUserId("64571aea4924d589282535c4");
  console.log(newOrder);
  res.json(newOrder);
});

router.route("/updateOrder").get(async (req, res) => {
  //code here for GET
  //Create a User by sending u and p.

  const user_data = req.body.usernameInput;
  const password_data = req.body.passwordInput;

  const uname = req.body.unameInput;
  const umail = req.body.umailInput;
  const umobile = req.body.umobileInput;
  const utype = req.body.operations_select;

  var newOrder = await orders.updateOrderProgress(
    "6457280a87ccdb879c6264f2",
    "completed",
    "we completed the project",
    "ram"
  );
  console.log(newOrder);
  res.json(newOrder);
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
  if (req.session.user) {
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
module.exports = router;
