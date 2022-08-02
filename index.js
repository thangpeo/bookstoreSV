const express = require('express')
const cors = require('cors');
const path = require('path');
const productRouter = require('./controllers/product');
const { default: mongoose } = require('mongoose');
const brandRouter = require('./controllers/brand');
const categoryRouter = require('./controllers/category');
const genreRouter = require('./controllers/genre');
const publisherRouter = require('./controllers/publisher');
const bannerRouter = require('./controllers/banner');
const userRouter = require('./controllers/user');
const orderRouter = require('./controllers/order');

const PORT = process.env.PORT || 5000
const URI = 'mongodb+srv://admin:DRkvRMp0ZcuUTfKy@bookstoredb.zasyt.mongodb.net/BookStore?retryWrites=true&w=majority'

const app = express()


app.use(cors())

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors())

// default page
app.get('/',(req, res)=>{
    res.sendFile(path.resolve('index.html'))
})

// products api 
app.use('/product', productRouter)

app.use('/category', categoryRouter)

app.use('/brand', brandRouter)

app.use('/genre', genreRouter)

app.use('/publisher', publisherRouter)

app.use('/banner', bannerRouter)

app.use('/user', userRouter)

app.use('/order', orderRouter)


mongoose.connect(URI)
    .then(() => {
        console.log('Connect to DB');
        app.listen(PORT,() =>{ 
            console.log(`server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('error: ',err);
    })
