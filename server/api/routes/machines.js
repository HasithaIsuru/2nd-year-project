const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Machine');
const Machine = mongoose.model('machines');

//Register machine
router.post('/', async (req, res) => {
    const existingMach = await Machine.findOne({ serialNumber: req.body.serialNumber })

    if (existingMach) {
        res.json({
            success: false,
            message: "Machine ID already in use"
        })
        return
    }
    const machine = new Machine({
        serialNumber: req.body.serialNumber,
        location: req.body.location,
        supervisorId: req.body.supervisorId,
        departmentId: req.body.departmentId
    })

    await machine.save()
    res.json({
        success: true,
        message: "Machine is Registered!"
    })

})

//get all machine details
router.get('/', async (req, res) => {
    const machDetails = await Machine.find()
    res.json({
        details: machDetails
    })
})

//check serialNumber is taken
router.get('/check/:serialNumber', async (req, res) => {
    const unique = await Machine.findOne({ serialNumber: req.params.serialNumber })
    if (unique) {
        res.json({
            unique: true
        })
    } else {
        res.json({
            unique: false
        })
    }
})

//get job details in a machine
router.get('/job/', async (req, res) => {
    const machDetails = await Machine.aggregate([
        { $lookup:
           {
             from: 'jobs',
             localField: '_id',
             foreignField: 'machineId',
             as: 'jobdetails'
           }
         }
        ])
    res.json({
        details: machDetails
    })
})

module.exports = router;