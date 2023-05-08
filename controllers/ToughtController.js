const Tought = require('../models/Tought')
const User = require('../models/User')
const {Op} = require('sequelize')

module.exports = class ToughtController {
    static async showToughts(req, res) {
        
        let search = ''
        
        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }
        
        const dataToughts = await Tought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            order: [['createdAt', order]]
        })

        const toughts = dataToughts.map((result) => result.get({plain: true}))
        const toughtsQty = toughts.length 

        res.render('toughts/home', {toughts, search, toughtsQty})
    }

    static createToughts(req, res) {
        res.render('toughts/create')
    }

    static async dashboard(req, res) {

        const userId = req.session.userid

        // Alem de consultar o usuário, o include busca na tabela Tougths todos os pensamentos com o mesmo ID
        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Tought,
            plain: true
        })

        // Verifica se o usuário existe
        if (!user) {
            res.redirect('/login')
        }

        // Analise o array 'user' e converte o 'dataValues' em um novo array limpo
        const toughts = user.Toughts.map((result) => result.dataValues)

        let emptyToughts = false

        if (toughts.length === 0) {
            emptyToughts = true
        }

        res.render('toughts/dashboard', {toughts, emptyToughts})
    }

    static async saveToughts(req, res) {
        const user = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Tought.create(user)
            
            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async removeTought(req, res){
        const userId = req.session.userid
        const id = req.body.id

        try {
            await Tought.destroy({ where: {id: id, userId: userId}})

            req.flash('message', 'Pensamento exluido com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async updateToughts(req, res){
        const id = req.params.id

        const tought = await Tought.findOne({where: {id: id}, raw: true})

        res.render('toughts/edit', {tought})
    }

    static async updateToughtsSave(req, res){
        const id = req.body.id

        const tought = {
            title: req.body.title
        }

        try {
            await Tought.update(tought, {where: {id: id}})

            req.flash('message', 'Pensamento atualizado com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
          console.log(error)  
        }
    }
}