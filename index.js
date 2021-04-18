// 17-April-2021

// npm init -y
// npm install express mongodb cors body-parser nodemon dotenv
// npm install firebase-admin --save
// total 7 items 

// "start": "node index.js",
// "start:dev": "nodemon index.js",


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is Running on port ==> ${port}`);
});

app.set('title', 'ProFix ==> Server is running...');

app.get('/', (req, res) => {
    res.send(`<h1>ProFix ==> Server is running...</h1>`);
})


// ################################################################################
// ################################################################################
//                             MongoBD with Server - Start
// ################################################################################
// ################################################################################
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9kin.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const servicesCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_SERVICES}`);
    const reviewsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_REVIEWS}`);
    const adminEmailCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ADMIN_EMAIL}`);


    // For Making Admin (Email)
    // Create || POST operation
    //#################################################################
    app.post('/addAdmin', (req, res) => {
        const adminEmail = req.body;
        console.log(adminEmail);
        adminEmailCollection.insertOne(adminEmail)
            .then(result => {
                // send to clint a true||false sms
                //res.status(200).send(result.insertedCount > 0);
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount > 0);
            })
    });
    //#################################################################



    // For Creating New Service | Admin Section
    // Create || POST operation  
    //#################################################################
    app.post('/addService', (req, res) => {
        const service = req.body;
        //console.log(service);
        servicesCollection.insertOne(service)
            .then(result => {
                // send to clint a true||false sms
                res.send(result.insertedCount > 0);
                //console.log(result.insertedCount > 0);
            })
    });
    //#################################################################



    // // Delete || Delete operation  ==> for Books
    // //#################################################################
    // app.delete('/deleteClientService/:id', (req, res) => {
    //     const bookId = req.params.id;
    //     console.log(bookId);

    //     //res.send(true);
    //     booksCollection.deleteOne({ _id: ObjectID(bookId) })
    //         .then(result => {
    //             res.send(result.deletedCount > 0);
    //             console.log(result.deletedCount);
    //         });
    // });



    // For Home Page, Display Create Services by Admin
    // Read || GET operation
    //#################################################################
    app.get('/allServices', (req, res) => {
        servicesCollection.find({})
            .toArray((err, services) => {
                res.send(services);
                //console.log(services);
            });
    });
    //#################################################################


    // For Home Page, Display Clients Review 
    // Read || GET operation
    //#################################################################
    app.get('/allReview', (req, res) => {
        reviewsCollection.find({})
            .toArray((err, reviews) => {
                res.send(reviews);
                //console.log(reviews);
            });
    });
    //#################################################################








    // Client Side    
    //#################################################################
    //#################################################################
    //#################################################################

    // For User giving reviews
    // Create || POST operation  
    //#################################################################
    app.post('/review', (req, res) => {
        const review = req.body;
        console.log(review);
        reviewsCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount > 0);
            });
    });
    //#################################################################







    // Read || GET operation ==> for Order
    //#################################################################
    // app.get('/allOrders', (req, res) => {

    //     // const bearer = req.headers.authorization;
    //     const userEmail = req.query.email;

    //     orderCollection.find({ email: userEmail })
    //         .toArray((err, order) => {
    //             res.send(order);
    //             console.log(order);
    //         });


    // });

    // Delete || Delete operation  ==> for Books
    //#################################################################
    // app.delete('/deleteOrder/:id', (req, res) => {
    //     const orderId = req.params.id;
    //     console.log(orderId);

    //     orderCollection.deleteOne({ _id: ObjectID(orderId) })
    //         .then(result => {
    //             res.send(result.deletedCount > 0);
    //             console.log(result.deletedCount);
    //         });

    // });


    console.log("DB connection ==> OK");
});
// ################################################################################
// ################################################################################
//                             MongoBD with Server - End
// ################################################################################
// ################################################################################