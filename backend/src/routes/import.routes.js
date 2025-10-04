const express = require('express')
const router = express.Router()
const importController = require('../controllers/import.controller')

router.post('/excel', importController.importExcel)

module.exports = router
