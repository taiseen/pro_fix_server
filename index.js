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

    const reviewsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_REVIEWS}`);
    const servicesCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_SERVICES}`);
    const adminEmailCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ADMIN_EMAIL}`);
    const serviceRequestCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_SERVICE_REQUEST}`);


    // Admin Side | API 
    //#################################################################
    //#################################################################
    //#################################################################

    // For Making Admin (Email)
    // Create || POST operation
    //#################################################################
    app.post('/addAdmin', (req, res) => {
        const adminEmail = req.body;
        adminEmailCollection.insertOne(adminEmail)
            .then(result => {
                // send to clint a true||false sms
                res.send(result.insertedCount > 0);
            })
    });
    //#################################################################


    // For Creating New Service | Admin Section
    // Create || POST operation  
    //#################################################################
    app.post('/addService', (req, res) => {
        const service = req.body;
        servicesCollection.insertOne(service)
            .then(result => {
                // send to clint a true||false sms
                res.send(result.insertedCount > 0);
            })
    });
    //#################################################################

    // For Deleting Client Services by Admin 
    // Delete || Delete operation  
    //#################################################################
    app.delete('/deleteClientService/:id', (req, res) => {
        const serviceID = req.params.id;
        serviceRequestCollection.deleteOne({ _id: ObjectID(serviceID) })
            .then(result => {
                res.send(result.deletedCount > 0);
            });
    });
    //#################################################################



    // Home Page | API 
    //#################################################################
    //#################################################################
    //#################################################################

    // For Home Page, Display Create Services by Admin
    // Read || GET operation
    //#################################################################
    app.get('/allServices', (req, res) => {
        servicesCollection.find({})
            .toArray((err, services) => {
                res.send(services);
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
            });
    });
    //#################################################################

    // For Home Page, Update Client Service Status
    // Update || PATCH operation
    //#################################################################
    app.patch('/update/:id', (req, res) => {

        const id = req.params.id;
        const serviceStatus = req.body;

        // console.log(id);
        // console.log(serviceStatus.status);

        serviceRequestCollection.updateOne({ _id: ObjectID(id) },
            {
                $set: {
                    status: serviceStatus.status
                }
            })
            .then(result => {
                //console.log(result);
                res.send(result.modifiedCount > 0);
            });

        // .findOneAndUpdate(
        //     { _id: id },
        //     { $set: { status: serviceStatus.service } }
        // ).then(result => {
        //     console.log(result);
        //     res.send(result)
        // });

    });
    //#################################################################




    // Client Side | API
    //#################################################################
    //#################################################################
    //#################################################################

    // For User giving reviews
    // Create || POST operation  
    //#################################################################
    app.post('/review', (req, res) => {
        const review = req.body;
        reviewsCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
    });
    //#################################################################


    // For User Request Service
    // Create || POST operation 
    // #################################################################
    app.post('/clientRequestService', (req, res) => {
        const serviceRequest = req.body;
        serviceRequestCollection.insertOne(serviceRequest)
            .then(result => {
                res.send(result.insertedCount > 0);
            });
    });
    //#################################################################


    // For Specific User Service Request List
    // Read || GET operation
    //#################################################################
    app.get('/yourServiceList', (req, res) => {
        const email = req.query.email;
        serviceRequestCollection.find({ email: email })
            .toArray((err, service) => {
                res.send(service);
            });
    });
    //#################################################################


    // For ALL User Service Request List | (For Admin)
    // Read || GET operation
    //#################################################################
    app.get('/allServiceRequest', (req, res) => {
        serviceRequestCollection.find({})
            .toArray((err, service) => {
                res.send(service);
            });
    });
    //#################################################################


    console.log("DB connection ==> OK");
});
// ################################################################################
// ################################################################################
//                             MongoBD with Server - End
// ################################################################################
// ################################################################################