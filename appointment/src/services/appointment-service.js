const { AppointmentRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class AppointmentService {

    constructor() {
        this.repository = new AppointmentRepository();
    }

    async getSchedulet({ _id }) {

        try {

            const scheduletItems = await this.repository.Schedulet(_id);

            return FormateData(scheduletItems)
        } catch (err) {
            throw err
        }

    }



    async PlaceOrder(userInput) {

        const { _id, txnNumber } = userInput

        // Verify the txn number with payment logs

        try {
            const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
            return FormateData(orderResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }

    }

    async GetOrders(studentId) {
        try {
            const orders = await this.repository.Orders(studentId);
            return FormateData(orders)
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    // get order details

    async ManageSchedulet(studentId, item, qty, isRemove) {

        try {

            console.log(item, 'Appointment Service Schedulet');

            const scheduletResult = await this.repository.AddScheduletItem(studentId, item, qty, isRemove);

            return FormateData(scheduletResult);
        } catch (err) {
            throw err;
        }

    }


    async SubscribeEvents(payload) {

        const { event, data } = payload;

        const { userId, tutor, qty } = data;

        switch (event) {
            case 'ADD_TO_SCHEDULET':
                this.ManageSchedulet(userId, tutor, qty, false);
                break;
            case 'REMOVE_FROM_SCHEDULET':
                this.ManageSchedulet(userId, tutor, qty, true);
                break;
            default:
                break;
        }

    }


    async GetOrderPayload(userId, order, event) {

        if (order) {
            const payload = {
                event: event,
                data: { userId, order }
            };

            return payload
        } else {
            return FormateData({ error: 'No Order Available' });
        }

    }



}

module.exports = AppointmentService;