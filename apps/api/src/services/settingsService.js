const Configuration = require("../models/Configuration");

exports.listSettings = async () => {
  return Configuration.find().sort({ clave: 1 });
};

exports.getSettingByKey = async (clave) => {
  return Configuration.findOne({ clave });
};

exports.updateSetting = async (clave, value) => {
  return Configuration.findOneAndUpdate({ clave }, { valor: value }, { new: true, upsert: true, runValidators: true });
};
