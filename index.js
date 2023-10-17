const express = require('express')

const cors = require('cors')

const app = express()

// necessario para ler o body
app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())

// cors
app.use(cors({ credentials: true,origin: 'http://localhost:3000'}))

// configuração do diretorio com os arquivos estaticos. exemplo: css e etc
app.use(express.static('public'))

// rotas
const UsuarioRoutes = require('./routes/UsuarioRoutes')
const ItemRoutes = require('./routes/ItemRoutes')
app.use('/usuario',UsuarioRoutes)
app.use('/item',ItemRoutes)

app.listen(5000)