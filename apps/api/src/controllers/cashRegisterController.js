const cashRegisterService = require("../services/cashRegisterService");

exports.openCashRegister = async (req, res, next) => {
  try {
    const register = await cashRegisterService.openRegister({
      usuario: req.user._id,
      apertura: req.body.apertura || 0
    });
    res.status(201).json(register);
  } catch (error) {
    next(error);
  }
};

exports.closeCashRegister = async (req, res, next) => {
  try {
    const register = await cashRegisterService.closeRegister(req.params.id, {
      ingresos: req.body.ingresos || 0,
      egresos: req.body.egresos || 0,
      saldo_final: req.body.saldo_final || 0
    });
    res.json(register);
  } catch (error) {
    next(error);
  }
};

exports.listCashRegisters = async (req, res, next) => {
  try {
    const result = await cashRegisterService.listRegisters(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
