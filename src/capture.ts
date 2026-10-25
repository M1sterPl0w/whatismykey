export interface Microphone {
  /** Sample rate of the blocks passed to `onBlock`, in Hz. */
  sampleRate: number;
  /** Releases the microphone. */
  stop(): Promise<void>;
}

// Runs on the audio thread and hands each block of microphone samples to the page.
const CAPTURE_WORKLET = `
class Capture extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0][0];
    if (channel) this.port.postMessage(channel.slice(0));
    return true;
  }
}
registerProcessor('capture', Capture);
`;

/**
 * Opens the microphone and passes each block of mono samples to `onBlock`. Rejects with the browser's
 * error when permission is denied or there is no microphone.
 */
export async function openMicrophone(onBlock: (block: Float32Array) => void): Promise<Microphone> {
  // Music is distorted by the filters meant for speech, so they are switched off.
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const context = new AudioContext();
  const workletUrl = URL.createObjectURL(new Blob([CAPTURE_WORKLET], { type: 'application/javascript' }));

  try {
    await context.audioWorklet.addModule(workletUrl);
    const node = new AudioWorkletNode(context, 'capture');
    node.port.onmessage = (event: MessageEvent<Float32Array>) => onBlock(event.data);
    context.createMediaStreamSource(stream).connect(node);
    await context.resume();
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    void context.close();
    throw error;
  } finally {
    URL.revokeObjectURL(workletUrl);
  }

  return {
    sampleRate: context.sampleRate,
    async stop() {
      stream.getTracks().forEach((track) => track.stop());
      await context.close();
    },
  };
}
