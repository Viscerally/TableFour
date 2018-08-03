import * as formHelp from '../client/libs/form-helper-func.js';

function setSocket(socket, react) {
  socket.on('connect', () => {
    console.log('Connected to websocket');
    let { res_code } = react.props;

    // LOAD ALL RESERVATIONS - DO NOT CHANGE
    socket.on('loadReservations', reservations => {
      let formData = {};
      let currentReservation = [];
      if (res_code) {
        currentReservation = reservations.filter(reservation => res_code === reservation.res_code);
      }
      formData = (currentReservation.length === 0) ? react.state.formData : currentReservation[0];
      react.setState({ formData, reservations });
    });

    // LOAD NEW RESERVATION - DO NOT CHANGE
    socket.on('loadNewReservation', ({ customer, reservation, path }) => {
      //Make sure that this gets called from MainComponent
      react.setState(oldState => {
        // we need customer data in reservations. please DON'T remove customer
        const reservations = [...oldState.reservations, { ...customer, ...reservation }];

        // instead of showing new reservation in the root,
        // it is better to display it in /reservations/:res_code because
        // so as to prevent each client from receiving other customers' reservations
        if (path !== '/admin') {
          window.location = `/reservations/${reservation.res_code}`;
        }

        return {
          currentCustomer: customer,
          currentReservation: reservation,
          reservations,
          res_code: reservation.res_code
        }
      })
    });

    // UPDATE RESERVATION DATA - DO NOT CHANGE
    socket.on('loadChangedReservation', data => {
      const { customer, reservation } = data;
      const newResList = react.state.reservations.map(currentReso => {
        if (currentReso.id === reservation.id) {
          // please do NOT remove customer. reservations need customer detail.
          currentReso = { ...customer, ...reservation };
        }
        return currentReso;
      });
      react.setState({
        currentCustomer: customer,
        currentReservation: reservation,
        reservations: newResList
      });
    });

    // UPDATE RESERVATION STATUS BY ADMIN - DO NOT CHANGE
    socket.on('changeReservationStatus', data => {
      const newResList = react.state.reservations.map(reservation => {
        if (reservation.id === data.reservation.id) {
          reservation = data.reservation;
        }
        return reservation;
      });
      react.setState({ reservations: newResList });
    });

    // CANCEL RESERVATION - DO NOT CHANGE
    socket.on('removeCancelledReservation', newData => {
      const reservations = react.state.reservations.filter(reso => reso.id !== newData.id);
      react.setState({
        currentCustomer: formHelp.blankCustomer(),
        currentReservation: formHelp.blankReservation(),
        reservations
      });
    });


    socket.on('loadReservation', data => {
      react.setState({ currentReservation: data });
    })

    socket.on('loadCustomer', data => {
      react.setState({ currentCustomer: data });
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

module.exports = { setSocket }
