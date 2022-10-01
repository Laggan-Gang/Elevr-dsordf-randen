"use strict";

const sampleRate = 48000;
const channels = 2
const BitsPerSample = 16
const sampleSize = BitsPerSample/8;

module.exports = (buffer) => {
    const totSize = 44+buffer.length;
    const buf = new Buffer.alloc(totSize);
    buf.write("RIFF", 0) // ChunkID
    buf.writeInt32LE(totSize-8,4) // ChunkSize (36 + SubChunk2Size)
    buf.write("WAVE",8); // Format
    buf.write("fmt ",12); // Subchunk1ID
    buf.writeInt32LE(16,16); // Subchunk1Size, 16 for PCM
    buf.writeInt16LE(1, 20); // AudioFormat PCM = 1
    buf.writeInt16LE(channels, 22); // NumChannels
    buf.writeInt32LE(sampleRate, 24) // SampleRate, hz
    buf.writeInt32LE(sampleRate * channels * sampleSize, 28) // ByteRate
    buf.writeInt16LE(channels * sampleSize, 32); // BlockAlign, bytes per one sample
    buf.writeInt16LE(BitsPerSample, 34); // BitsPerSample
    buf.write("data", 36) // SubChunk2ID
    buf.writeInt32LE(buffer.length, 40) // Subchunk2Size == NumSamples * NumChannels * BitsPerSample/8
    buf.fill(buffer, 44)
    return buf;
}