const mercadopago = require('mercadopago')

mercadopago.configure({
  access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
})

module.exports = {
  home: (req, res) => {
    return res.render('index')
  },
  detail: (req, res) => {
    return res.render('detail', { ...req.query })
  },

  callback: (req, res) => {

    console.log(req.query);
    if (req.query.status.includes('success')) {
      return res.render('success', {
        info : req.query
      })
    }
    if (req.query.status.includes('pending')) {
      return res.render('pending')
    }
    if (req.query.status.includes('failure')) {
      return res.render('failure')
    }

    return res.status(404).end()
  },

  webhooks: (req, res) => {
    res.send('webhooks: ' + req.body)
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
          street_number: 860
        },
      },
      notification_url: 'https://cert-mercado-pago-2020.herokuapp.com/webhooks',
      auto_return: 'approved',
      payment_methods: {
        installments: 12,
        excluded_payment_types: [
          {'id': 'atm'}
        ],
        excluded_payment_methods: [
          {'id': 'visa'}
        ]
      },
      items: [
        {
          id: 1234,
          title: 'Nombre del producto',
          description: 'Dispositivo móvil de Tienda e-commerce',
          unit_price: 450,
          quantity: 1,
        },
      ],
      back_urls: {
        success: 'https://cert-mercado-pago-2020.herokuapp.com/callback?status=success',
        pending: 'https://cert-mercado-pago-2020.herokuapp.com/callback?status=pending',
        failure: 'https://cert-mercado-pago-2020.herokuapp.com/callback?status=failure'
      }
    }

    mercadopago.preferences
      .create(preference)
      .then((response) => {
        global.init_point =  response.body.init_point
        res.render('confirm')
      })
      .catch((error) => {
        res.send('error')
      })
  },
}
