import crypto from "crypto";

export function gerarHash(valor) {
    return crypto
        .createHash("sha256")
        .update(valor)
        .digest("hex");
}