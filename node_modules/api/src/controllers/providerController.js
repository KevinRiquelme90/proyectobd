const providerService = require("../services/providerService");

exports.listProviders = async (req, res, next) => {
  try {
    const result = await providerService.listProviders(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.createProvider = async (req, res, next) => {
  try {
    const provider = await providerService.createProvider(req.body);
    res.status(201).json(provider);
  } catch (error) {
    next(error);
  }
};

exports.updateProvider = async (req, res, next) => {
  try {
    const provider = await providerService.updateProvider(req.params.id, req.body);
    res.json(provider);
  } catch (error) {
    next(error);
  }
};

exports.deleteProvider = async (req, res, next) => {
  try {
    await providerService.deleteProvider(req.params.id);
    res.json({ message: "Proveedor eliminado" });
  } catch (error) {
    next(error);
  }
};
