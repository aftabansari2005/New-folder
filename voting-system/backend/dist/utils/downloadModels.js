"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const MODELS_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const MODELS_DIR = path_1.default.join(__dirname, '../models/face-api');
const MODELS = [
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_expression_model-weights_manifest.json',
    'face_expression_model-shard1',
    'age_gender_model-weights_manifest.json',
    'age_gender_model-shard1',
];
if (!fs_1.default.existsSync(MODELS_DIR)) {
    fs_1.default.mkdirSync(MODELS_DIR, { recursive: true });
}
const downloadFile = (fileName) => {
    return new Promise((resolve, reject) => {
        const filePath = path_1.default.join(MODELS_DIR, fileName);
        const file = fs_1.default.createWriteStream(filePath);
        https_1.default.get(`${MODELS_URL}/${fileName}`, (response) => {
            if (response.statusCode === 404) {
                console.warn(`File not found: ${fileName}`);
                file.close();
                fs_1.default.unlink(filePath, () => resolve());
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${fileName}`);
                resolve();
            });
        }).on('error', (err) => {
            fs_1.default.unlink(filePath, () => reject(err));
        });
    });
};
const downloadModels = async () => {
    try {
        console.log('Downloading face-api models...');
        console.log(`Models will be saved to: ${MODELS_DIR}`);
        for (const model of MODELS) {
            try {
                await downloadFile(model);
            }
            catch (error) {
                console.error(`Error downloading ${model}:`, error);
            }
        }
        console.log('Models download completed!');
    }
    catch (error) {
        console.error('Error downloading models:', error);
    }
};
downloadModels();
//# sourceMappingURL=downloadModels.js.map