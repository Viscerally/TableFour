const namifyStr = str => str.toLowerCase().trim().replace(/^\w/, letter => letter.toUpperCase());

const getOnlyNumbers = str => str.replace(/\D/g, '');

const blankReservation = () => {
  return {
    placement_time: '',
    order_id: '',
    status: '',
    group_size: '',
    customer_id: '',
    res_code: ''
  }
}

const blankCustomer = () => {
  return {
    name: '',
    phone: '',
    email: ''
  }
}

const resoData = state => {
  const { customer, reservation, path } = state;
  return {
    name: namifyStr(customer.name),
    phone: getOnlyNumbers(customer.phone),
    group_size: reservation.group_size,
    email: customer.email,
    path
  }
}

module.exports = { blankReservation, blankCustomer, resoData };
