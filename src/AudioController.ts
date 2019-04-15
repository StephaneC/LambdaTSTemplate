'use strict';

import { ResponseFactory } from 'ask-sdk-core';
import { Response, interfaces } from 'ask-sdk-model';
import { HandlerInput } from 'ask-sdk';

class AudioController {

    private getToken(handlerInput): string {
        // Extracting token received in the request.
        if (handlerInput && handlerInput.requestEnvelope.context && handlerInput.requestEnvelope.context.AudioPlayer) {
          return handlerInput.requestEnvelope.context.AudioPlayer.token;
        }
        return null;
      }
      

    /*addScreenBackground(episode: Episode, response : Response) : Response {
        if (episode) {

            const directive = <interfaces.audioplayer.PlayDirective>response.directives[0]
            directive.audioItem['metadata'] = {
                title: episode.title.toUpperCase(),
                subtitle: episode.description,
                art: {
                    contentDescription: episode.title,
                    sources: [{
                        url: episode.image
                    }]
                },
                backgroundImage: {
                    contentDescription: episode.title,
                    sources: [{
                        url: episode.image
                    }]
                }
            };
        }
        return response;
    }*/

    play(input: HandlerInput, url: string, offset: number, text?: string): Response {
        console.log("Will play - " + url);
        /*
             *  Using the function to begin playing audio when:
             *      Play Audio intent invoked.
             *      Resuming audio when stopped/paused.
             *      Next/Previous commands issued.
             */

        /*
           https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#play
           REPLACE_ALL: Immediately begin playback of the specified stream, and replace current and enqueued streams.             
        */
        const result = ResponseFactory.init();

        //result.withStandardCard(episode.title, episode.description, episode.image, episode.image);

        // we are using url as token as they are all unique
        result
            .addAudioPlayerPlayDirective('REPLACE_ALL', url, url, offset)
            .withShouldEndSession(true);

        if (text) {
            result.speak(text);
        }

        // add support for radio meta data.  
        // this is not supported by the SDK yet, so it should be handled manually
        //const resp = this.addScreenBackground(episode, result.getResponse());
        //const resp = result.getResponse();
        return result.getResponse();
    }

    stop(text: string): Response {
        /*
         *  Issuing AudioPlayer.Stop directive to stop the audio.
         *  Attributes already stored when AudioPlayer.Stopped request received.
         */
        const result = ResponseFactory.init();
        result.addAudioPlayerStopDirective();

        if (text) {
            result.speak(text);
        }

        return result.getResponse();
    }

    clear(): Response {
        /*
         * Clear the queue and stop the player
         */
        const result = ResponseFactory.init();
        result.addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

        return result.getResponse();
    }
}
export const audio = new AudioController();