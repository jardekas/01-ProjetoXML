import { ContadorModel } from "../models/ContadorModel.js";

export const getVinculos = async (req, res) => {
  try {
    const { contadorId } = req.params;
    const vinculos = await ContadorModel.getVinculos(Number(contadorId));
    res.json(vinculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContador = async (req, res) => {
  try {
    const { contadorId } = req.params;
    const contador = await ContadorModel.findByUserId(Number(contadorId));
    if (!contador)
      return res.status(404).json({ error: "Contador não encontrado" });
    res.json(contador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addVinculo = async (req, res) => {
  try {
    const { contadorId } = req.params;
    const { cnpj } = req.body;
    if (!cnpj) return res.status(400).json({ error: "CNPJ obrigatório" });
    const vinculo = await ContadorModel.addVinculo(
      Number(contadorId),
      cnpj.replace(/\D/g, ""),
    );
    res.json({ message: "Vínculo adicionado", vinculo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeVinculo = async (req, res) => {
  try {
    const { contadorId, cnpj } = req.params;
    await ContadorModel.removeVinculo(Number(contadorId), cnpj);
    res.json({ message: "Vínculo removido" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
