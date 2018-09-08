const express = require('express')
const app = express()
const path = require("path")
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/dist', express.static(path.join(__dirname, './dist')));

app.get('/', function (req, res) {
  res.redirect('/produto/1321/checkout/6544')
})

app.get('/produto/:productId/checkout/:checkoutId', function (req, res) {
  res.sendFile('./views/checkout.html', { root: __dirname })
})

// Caso queira testar com mais de um tipo de cupom...
const coupon = [{
  id: 3,
  title: 'black friday',
  discount: 12
// }, {
//   id: 6,
//   title: 'valentine\'s day',
//   discount: 50
// },
// {
//   id: 10,
//   title: 'carnival',
//   discount: 12
}]

const product = {
  id: 1321,
  title: 'vestido floral',
  price: 100,
  image: 'https://res-5.cloudinary.com/enjoei/image/upload/c_fill,fl_lossy.progressive,h_398,q_70,w_375/qzancxcixtocajlrgztv.jpg'
}

const checkout = {
  id: 6544,
  productId: 1321,
  shippingPrice: 20,
  availableCoupons: coupon
}

app.get('/api/checkouts/:checkoutId', function (req, res) {
  checkout.totalPrice = product.price + checkout.shippingPrice

  if (req.query.couponId) {
    const couponChoosed = coupon.filter(item => item.id === parseInt(req.query.couponId, 10));
    if (couponChoosed.length) checkout.totalPrice -= couponChoosed[0].discount;
  }

  res.json({ product: product, checkout: checkout })
})

app.post('/api/checkouts/:checkoutId', function (req, res) {
  res.json({ status: req.body.type === "confirm" ? 'success' : 'cancelled' }); // Mock...
})

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`)
})
