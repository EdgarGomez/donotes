require("dotenv").config();

module.exports = {
  env: {
    REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_KEY: process.env.REACT_APP_SUPABASE_KEY,
  },
};
