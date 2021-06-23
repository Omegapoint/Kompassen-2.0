const { MONGO_URL, PORT } = process.env;

const config = {
  mongo_url: MONGO_URL || 'mongodb://localhost:27017/kompassen',
  port: PORT || '8080',
};

export default config;
