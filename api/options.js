module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    baseModels: [
      'zxc-1',
      'zxc-pear',
      'zxc-pear5',
      'zxc-turtle',
      'zxc-wave'
    ],
    motionOptions: [
      '',
      'Zoom in',
      'Zoom out',
      'Pan left',
      'Pan right',
      'Tilt up',
      'Tilt down',
      'Rotate clockwise',
      'Rotate counterclockwise'
    ],
    inferenceSteps: [
      '1-Step',
      '2-Step',
      '4-Step',
      '8-Step',
      '12-Step'
    ]
  });
}
