const {BookingRepository} = require('../repository/index');
const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
// const { axios } = require('axios');
const { default: axios } = require('axios');
const { ServiceError } = require('../utils/errors');
class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }
    async createBooking(data){
        try {
            const flightId = data.flightId;
            let getFlightUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            const response = await axios.get(getFlightUrl);
            const flightdata = response.data.data;
            let priceOfFlight = flightdata.price;
            if(flightdata.totalSeats < data.noOfSeats){
                throw new ServiceError('Something went wrong in the booking process','Insufficient seats in the flight');
            }
            const totalCost = data.noOfSeats * priceOfFlight;
            const bookingPayload = {... data,totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL,{totalSeats: flightdata.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id,{status : 'Booked'});
            return finalBooking;
        } catch (error) {
            if(error.name == 'RepositoryError'|| error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;