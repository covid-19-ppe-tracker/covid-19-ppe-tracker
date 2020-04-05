var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var logger = require('morgan');
const webpush = require('web-push');
var indexRouter = require('./routes/index');
const AdminBro = require('admin-bro')
const AdminBroSequelize = require('admin-bro-sequelizejs')
const AdminBroExpress = require('admin-bro-expressjs')
const argon2 = require('argon2');
AdminBro.registerAdapter(AdminBroSequelize)
const models = require('./models')
let adminBro = new AdminBro({
    databases: [models],
    rootPath: '/admin',
    branding: {
        companyName: 'COVID-19 PPE Tracker'
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
                        if (request.payload.password) {
                            request.payload.password = await argon2.hash(request.payload.password)
                        }
                        return request
                    },
                }
            }
        }
    }],
})

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        const user = await models.User.findOne({ 
            where: {
                email
            }
         })
        if (user) {
            const matched = await argon2.verify(user.dataValues.password, password)
            if (matched) {
                return user
            }
        }
        return false
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
})

// const router = AdminBroExpress.buildRouter(adminBro)

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
let sess = {
    secret: 'adasdjlkgjofjslcsadjlvsv',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) 
    sess.cookie.secure = true
}

app.use(session(sess))
app.use(adminBro.options.rootPath, router)
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

module.exports = app;
