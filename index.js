const axios = require('axios').default

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const serveStatic = require('serve-static')
app.use('/', serveStatic(require('path').join(__dirname, 'app_html')))

const { mongoose, Models } = require('./database')

const processOneAccount = async () => {
    let theAccount = await Models.MCAccount.find({ validState: { $gte: 0 } }).sort({ validState: 1, lastUpdate: 1 }).limit(1)
    theAccount = theAccount[0]
    console.log(theAccount)
    try {
        const response = await axios.post('https://authserver.mojang.com/authenticate', {
            agent: { name: 'Minecraft', version: 1 }, requestUser: true,
            username: theAccount.email || theAccount.username,
            password: theAccount.password,
        })
        console.log(response.data)
        await Models.MCAccount.findByIdAndUpdate(theAccount._id, {
            username: response.data.selectedProfile.name,
            uuid: response.data.selectedProfile.id,
            validState: 1,
            info: response.data,
            lastUpdate: new Date()
        })
    } catch (e) {
        console.error(e.response, e.toString())
        switch (e.response.status) {
            case 403: //Account ded
                await Models.MCAccount.findByIdAndUpdate(theAccount._id, {
                    validState: -1,
                    info: e.response.data,
                    lastUpdate: new Date()
                })
        }
    }
    setTimeout(processOneAccount, 15e3)
}
const main = async () => {
    processOneAccount()
}

app.get('/api/accounts', async (req, res) => res.json(await Models.MCAccount.find()))
app.post('/api/import', async (req, res) => {
    const accounts = req.body
    const log = []
    for (let account of accounts) {
        let datas = account.split(':')
        try {
            if (datas.length == 2)
                await Models.MCAccount.create({
                    email: datas[0],
                    password: datas[1]
                })
            else if (datas.length == 3)
                await Models.MCAccount.create({
                    username: datas[0],
                    email: datas[1],
                    password: datas[2]
                })
            else
                log.push(`Ignored "${ account }", invalid Format, missing Data`)
        } catch (e) {
            log.push(`${e}`)
        }
    }

    res.json(log.join('\n'))
})
main()
app.listen(6969)