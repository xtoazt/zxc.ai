module.exports = function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Video Generator API is running on Vercel' 
  });
}
