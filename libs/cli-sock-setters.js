import { returnResoArray } from '../client/libs/reservation-func.js';
import * as formHelp from '../client/libs/form-helper-func.js';
function setSocket(socket, react){

  socket.on('connect', () => {
    console.log('Connected to websocket');
    let {res_code} = react.props;

    socket.on('loadReservations', reservations => {
      let formData = {};
      let currentReservation = [];
      if (res_code) {
        currentReservation = reservations.filter(reservation => res_code === reservation.res_code);
      }
      formData = (currentReservation.length === 0) ? react.state.formData : currentReservation[0];
      react.setState({ formData, reservations });
    })

    // LOAD NEW RESERVATION
    socket.on('loadNewReservation', ({customer, reservation}) => {
      //Make sure that this gets called from MainComponent
      react.setState(oldState => {
        const reservations = [...oldState.reservations, reservation];
        const res_code = reservation.res_code;
        return {
          currentCustomer: customer,
          currentReservation: reservation,
          reservations: reservations,
          res_code: res_code
         }
      })
    })

    // UPDATE RESERVATION DATA
    socket.on('loadChangedReservation', data => {      
      const newResList = react.state.reservations.map(reservation => {
        if (reservation.id === data.reservation.id) {
          reservation = data.reservation;
        }
        return reservation;
      })
      react.setState(oldState => {
        return {
          currentCustomer : data.customer,
          currentReservation: data.reservation[0],
          reservations: newResList
         }
      })
    })

    // CANCEL RESERVATION

    socket.on('removeCancelledReservation', newData => {
      react.setState(oldState => {
        const reservations = react.state.reservations.filter(reso => {
          return reso.id !== newData[0].id;
        });
        return {
          currentCustomer: formHelp.blankCustomer(),
          currentReservation: formHelp.blankReservation(),
          reservations
        }
      });
    })

    socket.on('ItemOrdersWMenuItemInfo', menuItemOrders => {
      react.setState({ menuItemOrders });
    });

    socket.on('newOrderAdded', data => {
      react.setState(prevState => {
        return {
          menuItemOrders: [...prevState.menuItemOrders, data]
         };
      })
    })
  })
  return socket;
}

  module.exports = {
    setSocket
  }
