/* eslint-disable global-require */
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const middleware = require('../middleware');

module.exports = async ({ app, agenda }) => {
  /**
   * General
   */

  // if your not running behind a proxy, it's not required
  // default is disabled
  // normalde bir proxy arkasında çalışıyorken proxy ile iletişime geçen
  // bir client'ın ip adresi yerine proxy'nin ip adresini görürüz
  // trust proxy özelliğini aktifleştirerek header içine X-Forwarded-* başlığı ile
  // uyugulamamız ile konuşan client'ın ip adresi ve diğer bir kaç bilgisini elde edebiliriz
  // app.enable('trust proxy');

  // başka domain'lerden gelen istekleri kabul et
  // api'ımızı site üstünden kullanabilir
  // diğer türlüsü sadece kendi domainimiz üstünden gelen istekler kabul edilir
  // kısaca api yazıyorsak cors eklemek zorundayız
  app.use(cors());

  // ignore favicon
  app.use(middleware.ignoreFavicon);

  // set jwt secret
  app.set('jwt_secret', require('../config').secrets.jwt);

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
  app.use(bodyParser.urlencoded({ extended: false }));

  // parsing cookies
  app.use(cookieParser());

  /**
   * Logging
   */

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
  app.use('/dash', middleware.isAdmin, agenda);

  // api durumu hakkında bilgi döndürmek için kullanıyoruz
  // api erişilemez bir durumdaysa bu adreslerden dönen cevaba bakabiliriz
  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });

  // TODO: ADD API INFO
  // app.get('/api', (req, res) => {
  //   res.status(200);
  // });

  /**
   * Error Handling
   */

  // handle validation errors
  app.use(errors());

  // 404
  app.use((req, res) => {
    res.status(404);
    res.send({ error: `${req.originalUrl} not found` });
  });

  // 500 - Any server error
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send({ error: err });
  });

  return app;
};