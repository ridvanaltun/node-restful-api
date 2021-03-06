const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const middlewares = require('../middlewares')
const configs = require('../configs')
const enums = require('../enums')
const routes = require('../api')
const generalAPI = require('../api/general')

module.exports = async ({ app, agenda, blacklist }) => {
  /**
   * General
   */

  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // see https://expressjs.com/en/guide/behind-proxies.html
  // Normalde bir proxy arkasında çalışıyorken proxy ile iletişime geçen
  // bir client'ın ip adresi yerine proxy'nin ip adresini görürüz
  // trust proxy özelliğini aktifleştirerek header içine X-Forwarded-* başlığı ile
  // uyugulamamız ile konuşan client'ın ip adresi ve diğer bir kaç bilgisini elde edebiliriz
  // app.set('trust proxy', true);

  // full access of our API
  // başka domain'lerden gelen istekleri kabul et
  // api'ımızı site üstünden kullanabilir
  // diğer türlüsü sadece kendi domainimiz üstünden gelen istekler kabul edilir
  // kısaca api yazıyorsak cors eklemek zorundayız
  app.use(cors())

  // secure http headers
  app.use(helmet())

  // ignore favicon
  app.use(middlewares.ignoreFavicon)

  // remove empty properties from body, query and params
  // in this way we don't worry about the incomming data was empty or not
  app.use(middlewares.removeEmptyProperties())

  // bind blacklist to request object
  app.use(middlewares.bindReq('blacklist', blacklist))

  /**
   * Global Limitters
   *
   * General limiter for all requests.
   * Middleware with different logic and limiters can be applied to
   * exact route or application part as well.
   */

  const globalRateLimitOptions = {
    points: 10, // Number of points
    duration: 1 // Per second(s)
  }

  app.use(middlewares.rateLimitterMongo(globalRateLimitOptions))

  /**
   * Parsing
   */

  // support parsing of application/json type post data
  // req objesi bizim handler'ımıza gelmeden önce bu middleware'den geçiyor
  // req body'e json yazılmak zorunda
  app.use(bodyParser.json())

  // for parsing application/x-www-form-urlencoded
  // req objesi bizim handler'ımıza gelmeden önce bu middleware'den geçiyor
  // if extended is true -> url encoded data will parsed with qs library
  // if extended is false -> url encoded data will parsed with querystring library
  // extended olunca nested obje ve arrayler x-www-form-urlencoded ile gönderilebiliyor
  // package will parse the data sent through the form and attach it to the req.body object
  app.use(bodyParser.urlencoded({ extended: false }))

  // parsing cookies
  app.use(cookieParser())

  /**
   * Logging
   */

  // node.js logger
  // normalde bu kütüphaneyi sadece import ederek kullanabiliyoruz
  // sadece import ederek kullandığımız node'un built-in http modülünü kullanıyor
  // yapılan tüm http istekler console'a loglanır
  // pre-defined formats: common, combined, dev, short, tiny
  // istersek kendi formatımızı da oluşturabiliriz
  app.use(logger('dev'))

  // log only 4xx and 5xx responses to console
  // app.use(morgan('dev', {
  //   skip(req, res) { return res.statusCode < 400; },
  // }));

  // log all requests to access.log
  // app.use(morgan('common', {
  //   stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
  // }));

  /**
   * Handle Routes
   */

  // load general api routes
  app.use(enums.API.PREFIX, generalAPI.routers())

  // load api routes
  const { version } = configs.api
  app.use(`${enums.API.PREFIX}/${version}`, routes())

  // set agenda
  // todo: dockerize dash or use a different tool
  // todo: TooManyRequestsError
  app.use('/dash', agenda)

  /**
   * Error Handling
   */

  // raise 404 when path not found
  app.use(middlewares.notFoundHandler)

  // log errors to console
  const { dev: devMode } = configs.app
  if (devMode) app.use(middlewares.consoleLogErrors)

  // log request when an error occurred
  const { enable: isRequestLogEnabled, returnIdEnable: isReturnIdEnabled } = configs.requestLogs
  if (isRequestLogEnabled) app.use(middlewares.requestLogger(isReturnIdEnabled))

  // handle client errors
  app.use(middlewares.clientErrorHandler)

  // handle server errors
  app.use(middlewares.serverErrorHandler)

  return app
}
