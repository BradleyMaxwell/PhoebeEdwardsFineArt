const express = require('express')
const { createTestAccount } = require('nodemailer')
const router = express.Router()

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
})

router.get('/', (req, res) => {
    res.render('contact')
})

router.post('/', (req, res) => {
    
    const options = {
        from: process.env.USER_EMAIL,
        to: "phoebeedwardsfineart@outlook.com",
        subject: `${req.body.firstname} ${req.body.lastname}: ${req.body.subject}`,
        text: `${req.body.message} \n${req.body.email}`
    }

    transporter.sendMail(options, (error, info) => {
        if (error) {
            res.json({ message: "Something went wrong. Please try again."})
        } else {
            res.json({ message: "Contact successful! I'll get back to you as soon as I can. Thank you!"})
        }
    })
})

module.exports = router