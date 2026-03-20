import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const extensaoValida = file.originalname.match(/\.xml$/i);
    const mimeValido = ["text/xml", "application/xml"].includes(file.mimetype);

    if (!extensaoValida || !mimeValido) { //mime é o tipo de arquivo real, para caso seja renomeado para .xml, não suba.
        return cb(new Error("Apenas arquivos XML são permitidos!"), false);
    } cb(null, true);
};

export const upload = multer({ storage, fileFilter });