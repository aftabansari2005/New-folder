import fs from 'fs';
import path from 'path';
import https from 'https';

const MODELS_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const MODELS_DIR = path.join(__dirname, '../models/face-api');

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

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

// Download a file
const downloadFile = (fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(MODELS_DIR, fileName);
    const file = fs.createWriteStream(filePath);

    https.get(`${MODELS_URL}/${fileName}`, (response) => {
      if (response.statusCode === 404) {
        console.warn(`File not found: ${fileName}`);
        file.close();
        fs.unlink(filePath, () => resolve());
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${fileName}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });
  });
};

// Download all models
const downloadModels = async () => {
  try {
    console.log('Downloading face-api models...');
    console.log(`Models will be saved to: ${MODELS_DIR}`);
    
    for (const model of MODELS) {
      try {
        await downloadFile(model);
      } catch (error) {
        console.error(`Error downloading ${model}:`, error);
      }
    }
    
    console.log('Models download completed!');
  } catch (error) {
    console.error('Error downloading models:', error);
  }
};

downloadModels(); 