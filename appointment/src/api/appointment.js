const AppointmentService = require("../services/appointment-service");
const { PublishStudentEvent } = require("../utils");
const UserAuth = require('./middlewares/auth');

module.exports = (app) => {

    const service = new AppointmentService();

    app.post('/order', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;


        try {
            const { data } = await service.PlaceOrder({ _id, txnNumber });


            const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');

            PublishStudentEvent(payload);

            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/orders', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {
            const { data } = await service.GetOrders(_id);

            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    });

    app.get('/schedulet', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {

            const { data } = await service.getSchedulet({ _id });

            return res.status(200).json(data);

        } catch (err) {
            throw err;
        }
    })


}