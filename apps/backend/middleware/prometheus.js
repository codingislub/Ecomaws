const client = require('prom-client');
const responseTime = require('response-time');

// Collect default metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const activeConnections = new client.Gauge({
  name: 'nodejs_active_connections',
  help: 'Number of active connections',
  registers: [register]
});

const orderMetrics = new client.Counter({
  name: 'ecommerce_orders_total',
  help: 'Total number of orders created',
  labelNames: ['status'],
  registers: [register]
});

const productViews = new client.Counter({
  name: 'ecommerce_product_views_total',
  help: 'Total number of product views',
  labelNames: ['product_id'],
  registers: [register]
});

const paymentMetrics = new client.Counter({
  name: 'ecommerce_payments_total',
  help: 'Total number of payments',
  labelNames: ['method', 'status'],
  registers: [register]
});

const mongoConnections = new client.Gauge({
  name: 'mongodb_connections_active',
  help: 'Number of active MongoDB connections',
  registers: [register]
});

// Custom middleware for HTTP metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
      
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

module.exports = {
  metricsMiddleware,
  httpRequestDuration,
  httpRequestsTotal,
  activeConnections,
  orderMetrics,
  productViews,
  paymentMetrics,
  mongoConnections,
  register,
  promClient: client
};