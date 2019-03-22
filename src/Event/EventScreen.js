getPayments() {
    firebase
      .firestore()
      .collection("events")
      .doc()
      .collection("payments")
      .get()
      .then(payments => {
        // events[doc.id][payments] = []
        // payments.forEach(payment => {
        //   console.warn(payment.data())
        //   events[doc.id][payments][payment.id] = payment.data()
        // })
      })
  }