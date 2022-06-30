const { TutorModel } = require("../models");
const { APIError, BadRequestError } = require('../../utils/app-errors')

//Dealing with data base operations
class TutorRepository {


    async CreateTutor({ name, desc, type, unit, price, available, suplier, banner }) {

        try {
            const tutor = new TutorModel({
                name, desc, type, unit, price, available, suplier, banner
            })

            const tutorResult = await tutor.save();
            return tutorResult;

        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Tutor')
        }

    }


    async Tutors() {
        try {
            return await TutorModel.find();
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Tutors')
        }
    }

    async FindById(id) {
        try {
            return await TutorModel.findById(id);
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Tutor')
        }

    }

    async FindByCategory(category) {

        try {
            const tutors = await TutorModel.find({ type: category });
            return tutors;

        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
        }
    }

    async FindSelectedTutors(selectedIds) {
        try {
            const tutors = await TutorModel.find().where('_id').in(selectedIds.map(_id => _id)).exec();
            return tutors;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Tutor')
        }

    }

}

module.exports = TutorRepository;