// eslint-disable-next-line @typescript-eslint/no-var-requires
const VoiceResponse = require('twilio').twiml.VoiceResponse;

export function getOnCallEndedResponse() {
  const twiml = new VoiceResponse();
  twiml.say('Your response has been recorded, Thank you');
  twiml.pause({ length: 2 });
  twiml.hangup();
  return twiml.toString();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getOnCallAnsweredResponse(action: string) {
  const twiml = new VoiceResponse();
  twiml.reject();
  return twiml.toString();

  /*const SPEAKING_RATE = '65%';
  const PAUSE_DURATION = 1; // Seconds
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    numDigits: 1,
    action,
  });
  const introduction =
    'Patrols have been delayed on this site.' +
    'Please listen to the instructions carefully.';
  const firstInstruction = 'Press 1 for lack of a data bundle on the device';
  const secondInstruction =
    'Press 2 for any other issue with the patrol device or system';
  const thirdInstruction =
    'Hang up if there are no issues with submitting patrols';

  gather.pause({ length: PAUSE_DURATION });
  gather.say({ rate: SPEAKING_RATE }, introduction);
  gather.pause({ length: PAUSE_DURATION });
  gather.say({ rate: SPEAKING_RATE }, firstInstruction);
  gather.pause({ length: PAUSE_DURATION });
  gather.say({ rate: SPEAKING_RATE }, secondInstruction);
  gather.pause({ length: PAUSE_DURATION });
  gather.say({ rate: SPEAKING_RATE }, thirdInstruction);
  return twiml.toString();
   */
}
