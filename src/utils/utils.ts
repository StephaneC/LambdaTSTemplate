'use strict'
import { HandlerInput } from 'ask-sdk';

export const getApplicationId = (input: HandlerInput): string => {
    console.log('getApplicationId', JSON.stringify(input));
    if (input.requestEnvelope && input.requestEnvelope.session && input.requestEnvelope.session.application) {
        return input.requestEnvelope.session.application.applicationId;
    } else {
        return input.requestEnvelope.context.System.application.applicationId;
    }
}

export const getOffsetInMilliseconds = (handlerInput: HandlerInput) => {
    // Extracting offsetInMilliseconds received in the request.
    if (handlerInput && handlerInput.requestEnvelope.context && handlerInput.requestEnvelope.context.AudioPlayer) {
        return handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds;
    }
    return null;
}

export const getAudioToken = (handlerInput: HandlerInput) => {
    // Extracting token received in the request.
    if (handlerInput && handlerInput.requestEnvelope.context && handlerInput.requestEnvelope.context.AudioPlayer) {
        return handlerInput.requestEnvelope.context.AudioPlayer.token;
    }
    return null;
}