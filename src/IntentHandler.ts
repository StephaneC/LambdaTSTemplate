
'use strict';

import { HandlerInput, ResponseFactory, ErrorHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { audio } from './AudioController';
import { IHandler } from './utils/IHandler';
import { Constants } from './Constants';

export const IntentHandler: IHandler = {
    // launch request and play intent have the same handler
    'LaunchRequest': async function (input: HandlerInput): Promise<Response> {
        console.log('LaunchRequest');
        // first we clear session. Session had to be put in DynamoDB
        // because we close session each play podcast :/
        return Promise.resolve(audio.play(input, Constants.url, 0));
    },
    'AMAZON.ShuffleOnIntent': async function (input: HandlerInput): Promise<Response> {
        return this['random'](input);
    },
    'AMAZON.HelpIntent': async function (input: HandlerInput): Promise<Response> {
        //const msg = getMessage(getApplicationId(input), "HELP_MSG");
        return ResponseFactory.init()
            .speak('Bienvenue dans l\'application de Flash Brifing')
            .withShouldEndSession(false)
            .getResponse();
    },
    'SessionEndedRequest': async function (input: HandlerInput): Promise<Response> {
        // No session ended logic
        // do not return a response, as per https://developer.amazon.com/docs/custom-skills/handle-requests-sent-by-alexa.html#sessionendedrequest
        return Promise.resolve(input.responseBuilder.getResponse());
    },
    'System.ExceptionEncountered': async function (input: HandlerInput): Promise<Response> {
        console.log("\n******************* EXCEPTION **********************");
        console.log("\n" + JSON.stringify(input.requestEnvelope, null, 2));
        return Promise.resolve(input.responseBuilder.getResponse());
    },
    'Unhandled': async function (input: HandlerInput): Promise<Response> {
        input.responseBuilder.speak("Une erreur est survenue");
        return Promise.resolve(input.responseBuilder.withShouldEndSession(true).getResponse());
    },
    'AMAZON.PauseIntent': async function (input: HandlerInput): Promise<Response> {
        return Promise.resolve(audio.stop("A bientôt"));
    },
    'AMAZON.CancelIntent': async function (input: HandlerInput): Promise<Response> {
        return this['AMAZON.StopIntent'](input);
    },
    'AMAZON.StopIntent': async function (input: HandlerInput): Promise<Response> {
        return Promise.resolve(audio.stop("A bientôt"));
    },

    /*'AMAZON.StartOverIntent': async function (input: HandlerInput): Promise<Response> {
        input.responseBuilder.speak(i18n.S(input.requestEnvelope.request, 'NOT_POSSIBLE_MSG'));
        return Promise.resolve(input.responseBuilder.getResponse());
    },*/

    /*
     *  All Requests are received using a Remote Control. 
     *  https://developer.amazon.com/docs/custom-skills/playback-controller-interface-reference.html#requests 
     */
    'PlaybackController.PlayCommandIssued': async function (input: HandlerInput): Promise<Response> {
        return Promise.resolve(audio.play(input, Constants.url, 0, null));
    },
    'PlaybackController.NextCommandIssued': async function (input: HandlerInput): Promise<Response> {
        return Promise.resolve(input.responseBuilder.getResponse());
    },
    'PlaybackController.PreviousCommandIssued': async function (input: HandlerInput): Promise<Response> {
        return Promise.resolve(input.responseBuilder.getResponse());
    },
    'PlaybackController.PauseCommandIssued': async function (input: HandlerInput): Promise<Response> {
        return Promise.resolve(audio.stop(null));
    }
}

export const CustomErrorHandler: ErrorHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return true;
    },
    handle(input: HandlerInput, error: Error): Response {
        console.log('CustomErrorHandler');
        console.log(JSON.stringify(error));
        return input.responseBuilder
            .speak(Constants.messages.UNHANDLED_MSG)
            .withShouldEndSession(true).getResponse();

    }
};