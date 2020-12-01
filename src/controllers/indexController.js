const mercadopago = require('mercadopago')

mercadopago.configure({
  access_token:
    'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
})

module.exports = {
  home: (req, res) => {
    return res.render('index')
  },
  detail: (req, res) => {
    return res.render('detail', { ...req.query })
  },
  comprar: (req, res) => {
    let preference = {
      payer: {
        name: 'Ryan',
        surname: 'Dahl',
        email: 'test_user_63274575@testuser.com',
        phone: {
          area_code: '11',
          number: 55556666,
        },
        address: {
          zip_code: '1234',
          street_name: 'Monroe',
        },
      },
      items: [
        {
          id: '',
          picture_url: '',
          title: 'Zapatillas',
          price: '',
          description: '',
          unit_price: 5,
          quantity: 2,
        },
      ],
    }

    mercadopago.preferences
      .create(preference)
      .then((response) => {
        global.init_point = response.body.init_point
        console.log(response)
        res.render('confirm')
      })
      .catch((error) => {
        console.log(error)
        res.send('error')
      })
  },
}
