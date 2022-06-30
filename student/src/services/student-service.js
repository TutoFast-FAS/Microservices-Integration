const { StudentRepository } = require("../database");
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors')


// All Business logic will be here
class StudentService {

    constructor() {
        this.repository = new StudentRepository();
    }

    async SignIn(userInputs) {

        const { email, password } = userInputs;

        try {

            const existingStudent = await this.repository.FindStudent({ email });

            if (existingStudent) {

                const validPassword = await ValidatePassword(password, existingStudent.password, existingStudent.salt);

                if (validPassword) {
                    const token = await GenerateSignature({ email: existingStudent.email, _id: existingStudent._id });
                    return FormateData({ id: existingStudent._id, token });
                }
            }

            return FormateData(null);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }


    }

    async SignUp(userInputs) {

        const { email, password, phone } = userInputs;

        try {
            // create salt
            let salt = await GenerateSalt();

            let userPassword = await GeneratePassword(password, salt);

            const existingStudent = await this.repository.CreateStudent({ email, password: userPassword, phone, salt });

            const token = await GenerateSignature({ email: email, _id: existingStudent._id });

            return FormateData({ id: existingStudent._id, token });

        } catch (err) {
            throw new APIError('Data Not found', err)
        }

    }

    async AddNewAddress(_id, userInputs) {

        const { street, postalCode, city, country } = userInputs;

        try {
            const addressResult = await this.repository.CreateAddress({ _id, street, postalCode, city, country })
            return FormateData(addressResult);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }


    }

    async GetProfile(id) {

        try {
            const existingStudent = await this.repository.FindStudentById({ id });
            return FormateData(existingStudent);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async GetShopingDetails(id) {

        try {
            const existingStudent = await this.repository.FindStudentById({ id });

            if (existingStudent) {
                return FormateData(existingStudent);
            }
            return FormateData({ msg: 'Error' });

        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async GetWishList(studentId) {

        try {
            const wishListItems = await this.repository.Wishlist(studentId);
            return FormateData(wishListItems);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async AddToWishlist(studentId, tutor) {
        try {
            const wishlistResult = await this.repository.AddWishlistItem(studentId, tutor);
            return FormateData(wishlistResult);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async ManageSchedulet(studentId, tutor, qty, isRemove) {
        try {
            const scheduletResult = await this.repository.AddScheduletItem(studentId, tutor, qty, isRemove);
            return FormateData(scheduletResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async ManageOrder(studentId, order) {
        try {
            const orderResult = await this.repository.AddOrderToProfile(studentId, order);
            return FormateData(orderResult);
        } catch (err) {
            throw new APIError('Data Not found', err)
        }
    }

    async SubscribeEvents(payload) {

        const { event, data } = payload;

        const { userId, tutor, order, qty } = data;


        switch (event) {
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId, tutor)
                break;
            case 'ADD_TO_SCHEDULET':
                this.ManageSchedulet(userId, tutor, qty, false);
                break;
            case 'REMOVE_FROM_SCHEDULET':
                this.ManageSchedulet(userId, tutor, qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId, order);
                break;
            default:
                break;
        }

    }

}

module.exports = StudentService;