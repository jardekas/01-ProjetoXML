import jwt from "jsonwebtoken";
import { loginService } from "../services/AuthService.js";

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }
    const user = await loginService(email, senha);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "4h" },
    );

    res.json({ message: "Login realizado com sucesso", user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
