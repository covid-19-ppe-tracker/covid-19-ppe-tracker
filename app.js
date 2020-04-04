var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var logger = require('morgan');
const webpush = require('web-push');
var indexRouter = require('./routes/index');
const AdminBro = require('admin-bro')
const AdminBroSequelize = require('admin-bro-sequelizejs')
const AdminBroExpress = require('admin-bro-expressjs')
const bcrypt = require('bcrypt')
AdminBro.registerAdapter(AdminBroSequelize)
const models = require('./models')
let adminBro = new AdminBro({
    databases: [models],
    rootPath: '/admin',
    branding: {
        companyName: 'PPE Help'
    },
    resources: [{
        resource: models.User,
        options: {
            properties: {
                password: {
                    type: 'string',
                    isVisible: {
                        list: false, edit: true, filter: false, show: false,
                    }
                },
            },
            actions: {
                new: {
                    before: async (request) => {
                        console.log(request.payload);
                        
                        if (request.payload.password) {
                            request.payload.record = {
                                ...request.payload,
                                password: await bcrypt.hash(request.payload.password, 10),
                            }
                        }
                        return request
                    },
                }
            }
        }
    }],
})

const router = AdminBroExpress.buildRouter(adminBro)

const vapidKeys = {
    publicKey: fs.readFileSync("./server.pub").toString(),
    privateKey: fs.readFileSync('./server.priv').toString()
};

webpush.setVapidDetails(
    'mailto:web-push-book@gauntface.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
var app = express();

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(adminBro.options.rootPath, router)
app.use('/', indexRouter);

module.exports = app;
