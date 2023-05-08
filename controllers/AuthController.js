const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = class AuthController {
    static login (req, res) {
        res.render('auth/login')
    }

    static async loginPost (req, res) {
        const {email, password} = req.body

        // Busca o usuário
        const user = await User.findOne({where: {email: email}})

        // Confere se existe o usuário
        if (!user) {
            req.flash('message', 'E-mail não cadastrado!')
            res.render('auth/login')

            return
        }

        // Confere a senha
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            req.flash('message', 'Senha incorreta!')
            res.render('auth/login')

            return
        }

        // Iniciando sessão
        req.session.userid = user.id

        req.flash('message', `Bem vindo ${user.name}!`)

        // Redireciona apenas se salvar a sessão
        req.session.save(() => {
            res.redirect('/')
        })
    }

    static register (req, res) {
        res.render('auth/register')
    }

    static async registerPost (req, res) {
        const {name, email, password, confirmpassword} = req.body

        // Validação de senhas
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente')
            res.render('auth/register')

            return
        }

        // Verificando se existe usuário
        const checkSeExiste = await User.findOne({where: {email: email}})

        if (checkSeExiste) {
            req.flash('message', 'O e-mail já está em uso!')
            res.render('auth/register')

            return
        }

        // Criando senha segura
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const newUser = await User.create(user)

            // Iniciando sessão
            req.session.userid = newUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            // Redireciona apenas se salvar a sessão
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/login')
    }
}