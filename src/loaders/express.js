/* eslint-disable global-require */
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const {errors} = require('celebrate');
const helmet = require('helmet');
const middleware = require('../middleware');
const limitters = require('../api/limitters');

module.exports = async ({app, agenda}) => {
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
  app.use(cors());

  // secure http headers
  app.use(helmet());

  // ignore favicon
  app.use(middleware.ignoreFavicon);

  // remove empty properties from body, query and params
  // in this way we don't worry about the incomming data was empty or not
  app.use(middleware.removeEmptyProperties());

  /**
   * Global Limitters
   *
   * General limiter for all requests.
   * Middleware with different logic and limiters can be applied to
   * exact route or application part as well.
   */

  app.use(middleware.rateLimitterMongo(limitters.bruteForce));

  /**
   * Parsing
   */

  // support parsing of application/json type post data
  // req objesi bizim handler'ımıza gelmeden önce bu middleware'den geçiyor
  // req body'e json yazılmak zorunda
  app.use(bodyParser.json());

  // for parsing application/x-www-form-urlencoded
  // req objesi bizim handler'ımıza gelmeden önce bu middleware'den geçiyor
  // if extended is true -> url encoded data will parsed with qs library
  // if extended is false -> url encoded data will parsed with querystring library
  // extended olunca nested obje ve arrayler x-www-form-urlencoded ile gönderilebiliyor
  app.use(bodyParser.urlencoded({extended: false}));

  // parsing cookies
  app.use(cookieParser());

  /**
   * Logging
   */

  // log requests
  const {REQUEST_LOGGER_ENABLE, REQUEST_LOGGER_RETURN_ID} = process.env;
  if (REQUEST_LOGGER_ENABLE) app.use(middleware.requestLogger(REQUEST_LOGGER_RETURN_ID));

  // node.js logger
  // normalde bu kütüphaneyi sadece import ederek kullanabiliyoruz
  // sadece import ederek kullandığımız node'un built-in http modülünü kullanıyor
  // yapılan tüm http istekler console'a loglanır
  // pre-defined formats: common, combined, dev, short, tiny
  // istersek kendi formatımızı da oluşturabiliriz
  app.use(logger('dev'));

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

  // register routes to app
  const registerRoutes = require('../api');
  registerRoutes(app);

  // set agenda
  app.use('/dash', middleware.verifyToken, middleware.isAdmin, agenda);

  // api durumu hakkında bilgi döndürmek için kullanıyoruz
  // api erişilemez bir durumdaysa bu adreslerden dönen cevaba bakabiliriz
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // TODO: ADD API INFO
  // app.get('/api', (req, res) => {
  //   res.status(200);
  // });

  /**
   * Error Handling
   */

  // log errors
  app.use(middleware.logErrors);

  // handle celebrate errors
  app.use(errors());

  // 404
  app.use(middleware.notFoundHandler);

  // handle client errors
  app.use(middleware.clientErrorHandler);

  // handle server errors
  app.use(middleware.serverErrorHandler);

  return app;
};
