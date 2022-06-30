const TutorService = require('../services/tutor-service');
const { PublishStudentEvent, PublishAppointmentEvent } = require('../utils');
const UserAuth = require('./middlewares/auth')

module.exports = (app) => {

    const service = new TutorService();

    app.post('/tutor/create', async (req, res, next) => {

        try {
            const { name, desc, type, unit, price, available, suplier, banner } = req.body;
            // validation
            const { data } = await service.CreateTutor({ name, desc, type, unit, price, available, suplier, banner });
            return res.json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/category/:type', async (req, res, next) => {

        const type = req.params.type;

        try {
            const { data } = await service.GetTutorsByCategory(type)
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/:id', async (req, res, next) => {

        const tutorId = req.params.id;

        try {
            const { data } = await service.GetTutorDescription(tutorId);
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/ids', async (req, res, next) => {

        try {
            const { ids } = req.body;
            const tutors = await service.GetSelectedTutors(ids);
            return res.status(200).json(tutors);

        } catch (err) {
            next(err)
        }

    });

    app.put('/wishlist', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        // get payload // to send to student service 
        try {

            const { data } = await service.GetTutorPayload(_id, { tutorId: req.body._id }, 'ADD_TO_WISHLIST')

            PublishStudentEvent(data);

            return res.status(200).json(data.data.tutor);
        } catch (err) {

        }
    });

    app.delete('/wishlist/:id', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const tutorId = req.params.id;

        try {

            const { data } = await service.GetTutorPayload(_id, { tutorId }, 'REMOVE_FROM_WISHLIST')

            PublishStudentEvent(data);

            return res.status(200).json(data.data.tutor);

        } catch (err) {
            next(err)
        }
    });


    app.put('/schedulet', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {

            const { data } = await service.GetTutorPayload(_id, { tutorId: req.body._id, qty: req.body.qty }, 'ADD_TO_SCHEDULET')

            PublishStudentEvent(data);
            PublishAppointmentEvent(data)

            const response = {
                tutor: data.data.tutor,
                unit: data.data.qty
            }

            return res.status(200).json(response);

        } catch (err) {
            next(err)
        }
    });

    app.delete('/schedulet/:id', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const tutorId = req.params.id;

        try {

            const { data } = await service.GetTutorPayload(_id, { tutorId }, 'REMOVE_FROM_SCHEDULET')

            PublishStudentEvent(data)
            PublishAppointmentEvent(data)

            const response = {
                tutor: data.data.tutor,
                unit: data.data.qty
            }

            return res.status(200).json(response);

        } catch (err) {
            next(err)
        }
    });

    //get Top tutors and category
    app.get('/', async (req, res, next) => {
        //check validation
        try {
            const { data } = await service.GetTutors();
            return res.status(200).json(data);
        } catch (error) {
            next(err)
        }

    });

}