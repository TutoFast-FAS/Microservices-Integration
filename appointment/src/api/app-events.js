const AppointmentService = require('../services/appointment-service');

module.exports = (app) => {

    const service = new AppointmentService();

    app.use('/app-events', async (req, res, next) => {

        const { payload } = req.body;

        service.SubscribeEvents(payload);

        console.log("===============  Appointment Service Received Event ====== ");
        return res.status(200).json(payload);

    });

}