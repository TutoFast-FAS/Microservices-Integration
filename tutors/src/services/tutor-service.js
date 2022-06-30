const { TutorRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require('../utils/app-errors');

// All Business logic will be here
class TutorService {

    constructor() {
        this.repository = new TutorRepository();
    }

    async CreateTutor(tutorInputs) {
        try {
            const tutorResult = await this.repository.CreateTutor(tutorInputs)
            return FormateData(tutorResult);
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async GetTutors() {
        try {
            const tutors = await this.repository.Tutors();

            let categories = {};

            tutors.map(({ type }) => {
                categories[type] = type;
            });

            return FormateData({
                tutors,
                categories: Object.keys(categories),
            })

        } catch (err) {
            throw new APIError('Data Not found')
        }
    }


    async GetTutorDescription(tutorId) {
        try {
            const tutor = await this.repository.FindById(tutorId);
            return FormateData(tutor)
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async GetTutorsByCategory(category) {
        try {
            const tutors = await this.repository.FindByCategory(category);
            return FormateData(tutors)
        } catch (err) {
            throw new APIError('Data Not found')
        }

    }

    async GetSelectedTutors(selectedIds) {
        try {
            const tutors = await this.repository.FindSelectedTutors(selectedIds);
            return FormateData(tutors);
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async GetTutorById(tutorId) {
        try {
            return await this.repository.FindById(tutorId);
        } catch (err) {
            throw new APIError('Data Not found')
        }
    }

    async GetTutorPayload(userId, { tutorId, qty }, event) {

        const tutor = await this.repository.FindById(tutorId);

        if (tutor) {
            const payload = {
                event: event,
                data: { userId, tutor, qty }
            }
            return FormateData(payload)
        } else {
            return FormateData({ error: 'No tutor available' })
        }


    }

}

module.exports = TutorService;