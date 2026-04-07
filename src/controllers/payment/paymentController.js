const { Plans, Subscription, Payment, OrderDetails } = require('../../models');
const { client } = require('../config/paypalClient');
const paypal = require('@paypal/checkout-server-sdk');


// ==============================
// ✅ CREATE SUBSCRIPTION (CREATE ORDER)
// ==============================
exports.createSubscription = async (req, res) => {
  try {
    const { planCode, adminEmail, userId } = req.body;

    if (!planCode || !adminEmail || !userId) {
      return res.status(400).json({ message: "planCode, adminEmail, userId required" });
    }

    const plan = await Plans.findOne({
      where: { planCode, planStatus: 'ACTIVE' }
    });

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // ❗ Prevent multiple active subscriptions
    const existingSub = await Subscription.findOne({
      where: {
        adminEmail,
        status: "ACTIVE"
      }
    });

    if (existingSub) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    // 🔹 Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: plan.salePrice
        },
        description: `${plan.planName} Subscription`
      }],
      application_context: {
        return_url: `https://yourdomain.com/api/subscription/execute?adminEmail=${adminEmail}&planCode=${planCode}&userId=${userId}`,
        cancel_url: `https://yourdomain.com/cancel`
      }
    });

    const order = await client().execute(request);

    // 🔹 Save Order
    await OrderDetails.create({
      orderID: order.result.id,
      userId,
      currencyCode: "USD",
      email: adminEmail,
      total: plan.salePrice,
      orderStatus: "PAYMENT_INPROGRESS"
    });

    return res.status(200).json({ id: order.result.id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};


// ==============================
// ✅ EXECUTE SUBSCRIPTION (CAPTURE)
// ==============================
exports.executeSubscription = async (req, res) => {
  try {
    const { token, adminEmail, planCode, userId } = req.query;

    if (!token || !adminEmail || !planCode || !userId) {
      return res.status(400).json({ message: "Missing params" });
    }

    // 🔹 Capture PayPal payment
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});
    const capture = await client().execute(captureRequest);

    const paymentId = capture.result.id;
    const currency = capture.result.purchase_units[0].amount.currency_code;
    const amount = capture.result.purchase_units[0].amount.value;

    // 🔹 Update Order
    await OrderDetails.update({
      orderStatus: "PAYMENT_COMPLETED",
      merchantTransactionId: paymentId
    }, {
      where: { orderID: token }
    });

    // 🔹 Get plan
    const plan = await Plans.findOne({ where: { planCode } });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // 🔹 Calculate end date
    const endDate = plan.planDuration > 0
      ? new Date(Date.now() + plan.planDuration * 30 * 24 * 60 * 60 * 1000)
      : null;

    // 🔹 Create Payment
    await Payment.create({
      userId,
      planCode,
      planName: plan.planName,
      amount,
      currency,
      status: "succeeded",
      stripePaymentIntentId: paymentId,
      endDate
    });

    // 🔹 Create Subscription
    await Subscription.create({
      adminEmail,
      planCode,
      planName: plan.planName,
      recruiterLimit: plan.recruiterLimit,
      planDuration: plan.planDuration,
      jobLimitPerWeek: plan.planType === "FREE" ? 2 : 50,
      startDate: new Date(),
      endDate,
      payment_method: "PayPal",
      transactionId: paymentId,
      paymentDate: new Date(),
      paymentStatus: "COMPLETED",
      status: "ACTIVE"
    });

    return res.redirect('/thank-you');

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};