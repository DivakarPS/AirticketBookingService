const {BookingService} = require('../services/index');
const { StatusCodes } = require('http-status-codes');

const bookingService = new BookingService();

const create = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            data: response,
            message: 'Succesfully created the booking',
            success: true,
            err: {}
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            data: {},
            message: error.message,
            success: false,
            err: error.explanation
        });
    }
}

module.exports = {
    create
}