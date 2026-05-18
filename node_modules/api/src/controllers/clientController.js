const clientService = require("../services/clientService");

exports.listClients = async (req, res, next) => {
  try {
    const result = await clientService.listClients(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    await clientService.deleteClient(req.params.id);
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    next(error);
  }
};
