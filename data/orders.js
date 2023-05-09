const mongoCollections = require("../config/mongoCollections");
const orders = mongoCollections.orders;
const { ObjectId } = require("mongodb");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

//space check
function hasWhiteSpace(s) {
  return s.indexOf(" ") >= 0;
}
//alpha numeric
function onlyLettersAndNumbers(str) {
  return /^[A-Za-z0-9]*$/.test(str);
}
//checking Password must have at least one uppercase character, one number and  one special character.
function checkPassword(str) {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/.test(str);
}

const createOrder = async (
  userId,
  PanelType,
  PowerOutput,
  Quantity,
  Price,
  DeliveryTimeline,
  Description
) => {
  //validate data first

  //Order does not exist, therefore save record

  // date
  const currentDate = new Date();
  const datePosted = currentDate.toISOString().split("T")[0];
  // console.log(datePosted);

  let order_progress = {
    status: "Order Created",
    comment: "Order created by customer",
    approved_by: userId,
    date_posted: datePosted,
  };

  let new_order = {
    userId: userId,
    panelType: PanelType,
    powerOutput: PowerOutput,
    quantity: Quantity,
    price: Price,
    deliveryTimeline: DeliveryTimeline,
    description: Description,
    date_posted: datePosted,
    status: "Order Created",
    message: " ",
    temp: "11",
    history: [order_progress],
  };
  console.log("new_order", new_order);
  const orderCollection = await orders();

  const insertInfo = await orderCollection.insertOne(new_order);
  if (!insertInfo.insertedId) throw "Could not add order";

  const inserted_Order = await getOrderById(insertInfo.insertedId);
  console.log("inserted_Order", inserted_Order);
  return { inserted_Order: true };
};

const getAllOrders = async () => {
  const OrderCollection = await orders();
  const Orderr_id = await OrderCollection.find({}).toArray();
  return Orderr_id;
};

const getOrdersByStatus = async (status) => {
  const OrderCollection = await orders();
  const Orderr_id = await OrderCollection.find({ status: status }).toArray();
  return Orderr_id;
};

const getOrderById = async (id) => {
  const OrderCollection = await orders();
  const Orderr_id = await OrderCollection.findOne({
    _id: ObjectId(id),
  });
  return Orderr_id;
};

const getOrderByUserId = async (id) => {
  const OrderCollection = await orders();
  const Orderr_id = await OrderCollection.find({
    userId: id,
  }).toArray();
  return Orderr_id;
};

const updateOrderProgress = async (id, status, review, userid) => {
  const OrderCollection = await orders();
  // date
  const currentDate = new Date();
  const datePosted = currentDate.toISOString().split("T")[0];

  let order_progress = {
    status: status,
    comment: review,
    approved_by: userid,
    date_posted: datePosted,
  };

  const Orderr_id = await OrderCollection.updateOne(
    { _id: ObjectId(id) },
    {
      $push: { history: order_progress },
      $set: { status: status },
    }
  );
  return Orderr_id;
};

// status  update
// const updateStatus = async (order_id, status, message) => {
//   // const pageCollection = await pageInfo();
//   const orderCollection = await orders();
//   let obj;
//   obj = {
//     status: status,
//     message: message,
//   };
//   // we use $set to update only the fields specified
//   await orderCollection.updateOne(
//     { _id: ObjectId(order_id) },
//     { $set: { about: obj } }
//   );
//   console.log(obj);
//   registration_response = "Successfully Updated status";
//   return registration_response;
// };

const updateStatus = async (order_id, status, message) => {
  const orderCollection = await orders();

  // Update the status field
  await orderCollection.updateOne(
    { _id: ObjectId(order_id) },
    { $set: { status: status, message: message } }
  );

  console.log("Successfully updated status and message");

  return "Successfully updated status and message";
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrdersByStatus,
  getOrderByUserId,
  updateOrderProgress,
  updateStatus,
};
