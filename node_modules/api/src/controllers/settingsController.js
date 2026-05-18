const settingsService = require("../services/settingsService");

exports.listSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.listSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

exports.updateSetting = async (req, res, next) => {
  try {
    const setting = await settingsService.updateSetting(req.params.clave, req.body.valor);
    res.json(setting);
  } catch (error) {
    next(error);
  }
};
