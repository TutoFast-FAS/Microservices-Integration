const { StudentModel, AddressModel } = require('../models');
const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors')

//Dealing with data base operations
class StudentRepository {

    async CreateStudent({ email, password, phone, salt }) {
        try {
            const student = new StudentModel({
                email,
                password,
                salt,
                phone,
                address: []
            })
            const studentResult = await student.save();
            return studentResult;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Student')
        }
    }

    async CreateAddress({ _id, street, postalCode, city, country }) {

        try {
            const profile = await StudentModel.findById(_id);

            if (profile) {

                const newAddress = new AddressModel({
                    street,
                    postalCode,
                    city,
                    country
                })

                await newAddress.save();

                profile.address.push(newAddress);
            }

            return await profile.save();

        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Error on Create Address')
        }
    }

    async FindStudent({ email }) {
        try {
            const existingStudent = await StudentModel.findOne({ email: email });
            return existingStudent;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Student')
        }
    }

    async FindStudentById({ id }) {

        try {
            const existingStudent = await StudentModel.findById(id).populate('address')

            return existingStudent;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Student');
        }
    }

    async Wishlist(studentId) {
        try {
            const profile = await StudentModel.findById(studentId).populate('wishlist');

            return profile.wishlist;
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Wishlist ')
        }
    }

    async AddWishlistItem(studentId, { _id, name, desc, price, available, banner }) {


        const tutor = {
            _id, name, desc, price, available, banner
        };

        try {
            const profile = await StudentModel.findById(studentId).populate('wishlist');

            if (profile) {

                let wishlist = profile.wishlist;

                if (wishlist.length > 0) {
                    let isExist = false;
                    wishlist.map(item => {
                        if (item._id.toString() === tutor._id.toString()) {
                            const index = wishlist.indexOf(item);
                            wishlist.splice(index, 1);
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        wishlist.push(tutor);
                    }

                } else {
                    wishlist.push(tutor);
                }

                profile.wishlist = wishlist;
            }

            const profileResult = await profile.save();

            return profileResult.wishlist;

        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Add to WishList')
        }

    }


    async AddScheduletItem(studentId, { _id, name, price, banner }, qty, isRemove) {

        try {

            const profile = await StudentModel.findById(studentId).populate('schedulet');

            if (profile) {

                const scheduletItem = {
                    tutor: { _id, name, price, banner },
                    unit: qty,
                };

                let scheduletItems = profile.schedulet;

                if (scheduletItems.length > 0) {
                    let isExist = false;
                    scheduletItems.map(item => {

                        if (item.tutor._id.toString() === _id.toString()) {
                            if (isRemove) {
                                scheduletItems.splice(scheduletItems.indexOf(item), 1);
                            } else {
                                item.unit = qty;
                            }
                            isExist = true;
                        }
                    });

                    if (!isExist) {
                        scheduletItems.push(scheduletItem);
                    }
                } else {
                    scheduletItems.push(scheduletItem);
                }

                profile.schedulet = scheduletItems;

                const scheduletSaveResult = await profile.save();

                return scheduletSaveResult;
            }

            throw new Error('Unable to add to schedulet!');

        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Student')
        }

    }

    async AddOrderToProfile(studentId, order) {


        try {

            const profile = await StudentModel.findById(studentId);

            if (profile) {

                if (profile.orders == undefined) {
                    profile.orders = []
                }
                profile.orders.push(order);

                profile.schedulet = [];

                const profileResult = await profile.save();

                return profileResult;
            }

            throw new Error('Unable to add to order!');

        } catch (err) {

            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Student')
        }

    }

}

module.exports = StudentRepository;