import { returnResoArray } from '../client/libs/reservation-func.js';
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
    });

    // LOAD NEW RESERVATIONS
    socket.on('loadNewReservation', newReservation => {
      react.setState(oldState => {
        const reservations = [...oldState.reservations, newReservation];
        return { formData: newReservation, reservations };
      });
    })

    // UPDATE RESERVATION DATA
    socket.on('loadChangedReservation', newReservation => {
      react.setState(oldState => {
        const reservations = returnResoArray(oldState.reservations, newReservation);
        return { formData: newReservation, reservations };
      });
    })

    // CANCEL RESERVATION
    socket.on('removeCancelledReservation', newData => {
      react.setState(oldState => {
        const reservations = returnResoArray(oldState.reservations, newData);

        return {
          formData: { name: '', phone: '', group_size: '', email: '', res_code: '' },
          reservations
        };
      });
    })

    socket.on('ItemOrdersWMenuItemInfo', menuItemOrders => {
      console.log('Message received on the client!');
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
