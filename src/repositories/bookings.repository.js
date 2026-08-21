export class BookingRepository {
  constructor(bookingDao) {
    this.bookingDao = bookingDao;
  }
 async getBooking() {
    return await this.bookingDao.getBooking();
  }
  async getBookingById(id) {
    return await this.bookingDao.getBookingById(id);
  }

  async createBooking(bookingData) {
    return await this.bookingDao.createBooking(bookingData);
  }

  async addServiceToBooking(bookingId, booking) {
    return await this.bookingDao.addServiceToBooking(bookingId, booking);
  }
}
