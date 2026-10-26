// Owner-confirmed mapping; source audio is not exposed as a static public asset.
// Approval and assignment: specs/003-historias-educativas/evidence/audio-assignment.md
export const initialStoryAudio = {
  "llamada-sospechosa": {
    "file": "hidtoria_dos_editada.mp3.mpeg",
    "sha256": "e2b5cc15f2f5441b5e5af0f0b0d34958d0b9ce718de5b1eea02d361ab1ec5c4a",
    "mime": "audio/mpeg",
    "durationSeconds": 118.993042
  },
  "enlace-falso": {
    "file": "historia_tres_editada.mp3.mpeg",
    "sha256": "28a3a3c0aed63c378163bc1c1920b407322b7a2b5becaa6e054228191c66654e",
    "mime": "audio/mpeg",
    "durationSeconds": 142.999542
  },
  "contrasena-compartida": {
    "file": "historia_uno_editada.mp3.mpeg",
    "sha256": "9c2e77e15c19926031f11c18d731771fb08918818bf2f5eb2917b04d67f69ba0",
    "mime": "audio/mpeg",
    "durationSeconds": 138.7155
  }
} as const;
