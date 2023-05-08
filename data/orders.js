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

  let new_order = {
    userId: userId,
    panelType: PanelType,
    powerOutput: PowerOutput,
    quantity: Quantity,
    price: Price,
    deliveryTimeline: DeliveryTimeline,
    description: Description,
    date_posted: Date.now(),
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

  let order_progress = {
    status: status,
    comment: review,
    approved_by: userid,
    date_posted: Date.now(),
  };

  const Orderr_id = await OrderCollection.updateOne(
    { _id: ObjectId(id) },
    { $push: { history: order_progress } }
  );
  return Orderr_id;
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrderByUserId,
  updateOrderProgress,
};
