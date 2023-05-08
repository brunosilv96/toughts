const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')
const checkAuth = require('../helpers/auth').checkAuth

router.post('/remove', checkAuth, ToughtController.removeTought)
router.post('/add', checkAuth, ToughtController.saveToughts)
router.post('/update', checkAuth, ToughtController.updateToughtsSave)
router.get('/edit/:id', checkAuth, ToughtController.updateToughts)
router.get('/add', checkAuth, ToughtController.createToughts)
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.get('/', ToughtController.showToughts)

module.exports = router