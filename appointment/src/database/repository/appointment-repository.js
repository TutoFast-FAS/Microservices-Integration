const { StudentModel, TutorModel, OrderModel, ScheduletModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { APIError, BadRequestError } = require('../../utils/app-errors')


//Dealing with data base operations
class AppointmentRepository {

    // payment

    async Orders(studentId) {
        try {
            const orders = await OrderModel.find({ studentId });
            return orders;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders')
        }
    }

    async Schedulet(studentId) {

        try {

            const scheduletItems = await ScheduletModel.find({
                studentId: studentId
            })
            if (scheduletItems) {
                return scheduletItems;
            }

            throw new Error('Data not Found!')

        } catch (err) {
            throw err;
        }

    }


    async AddScheduletItem(studentId, item, qty, isRemove) {

        try {

            const schedulet = await ScheduletModel.findOne({ studentId: studentId });

            const { _id } = item;

            if (schedulet) {

                let isExist = false;

                let scheduletItems = schedulet.items;

                if (scheduletItems.length > 0) {

                    scheduletItems.map(item => {

                        if (item.tutor._id.toString() === _id.toString()) {

                            if (isRemove) {

                                scheduletItems.splice(scheduletItems.indexOf(item), 1);

                                console.log(scheduletItems);

                            } else {
                                item.unit = qty;
                            }
                            isExist = true;
                        }
                    });
                }


                if (!isExist && !isRemove) {
                    scheduletItems.push({ tutor: { ...item }, unit: qty });
                }

                schedulet.items = scheduletItems;

                return await schedulet.save();

            } else {
                return await ScheduletModel.create({
                    studentId,
                    items: [{ tutor: { ...item }, unit: qty }]
                });
            }


        } catch (err) {

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Student')
        }

    }


    async CreateNewOrder(studentId, txnId) {

        //check transaction for payment Status

        try {
            const schedulet = await ScheduletModel.findOne({ studentId: studentId });

            console.log(schedulet);

            if (schedulet) {

                let amount = 0;

                let scheduletItems = schedulet.items;

                if (scheduletItems.length > 0) {
                    //process Order
                    scheduletItems.map(item => {
                        amount += parseInt(item.tutor.price) * parseInt(item.unit);
                    });

                    // 86873645
                    const orderId = uuidv4();

                    const order = new OrderModel({
                        orderId,
                        studentId,
                        amount,
                        txnId,
                        status: 'received',
                        items: scheduletItems
                    })

                    schedulet.items = [];

                    const orderResult = await order.save();

                    await schedulet.save();

                    return orderResult;
                }
            }

            return {}

        } catch (err) {


            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
        }


    }
}

module.exports = AppointmentRepository;