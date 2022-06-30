const StudentService = require('../services/student-service');

module.exports = (app) => {

    const service = new StudentService();

    app.use('/app-events', async (req,res,next) => {

        const { payload } = req.body;

        service.SubscribeEvents(payload);

        console.log("===============  Student Service Received Event ====== ");
        return res.status(200).json(payload);

    });

}