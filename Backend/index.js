const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const app = express()

// database connection 

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// routes connection 
app.use('/api/users', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/uploads', uploadRoutes)

// express code 
app.get('/', (req, res) => {
    res.send('Hello akshat!')
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
