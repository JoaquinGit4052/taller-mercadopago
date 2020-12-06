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
    console.log(req.query)
    if (req.query.status.includes('success')) {
      return res.render('success', {
        payment_type: req.query.payment_type,
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
    console.log('webhooks: ', req.body)
    return res.status(200).send(req.body)
  },
  comprar: (req, res) => {
    const host = 'https://cert-mercado-pago-2020.herokuapp.com/'
    const url = 'callback?status='
    let preference = {
      payer: {
        name: 'Lalo',
        surname: 'Landa',
        email: 'test_user_63274575@testuser.com',
        phone: {
          area_code: '11',
          number: 22223333,
        },
        address: {
          zip_code: '1111',
          street_name: '',
          street_number: 123,
        },
      },
      payment_methods: {
        installments: 6,
        excluded_payment_types: [{ id: 'atm' }],
        excluded_payment_methods: [{ id: 'amex' }],
      },
      items: [
        {
          id: 1234,
          title: 'Nike Jordan',
          description: 'Dispositivo móvil de Tienda e-commerce',
          picture_url: '/images/products/jordan.jpg',
          unit_price: 16500,
          quantity: 1,
        },
      ],
      back_urls: {
        success: host + url + 'success',
        pending: host + url + 'pending',
        failure: host + url + 'failure',
      },
      notification_url: host + 'webhooks',
      auto_return: 'approved',
      external_reference: 'joaquiperles@live.com.ar',
    }

    mercadopago.preferences
      .create(preference)
      .then((response) => {
        global.init_point = response.body.init_point
        res.render('confirm')
      })
      .catch((error) => {
        res.send('error')
      })
  },
}
