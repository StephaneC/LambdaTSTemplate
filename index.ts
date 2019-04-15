
import * as AWS from 'aws-sdk';
import { SkillBuilders } from 'ask-sdk';
import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';
import { IntentHandler, CustomErrorHandler } from './src/IntentHandler';
import { CheckAudioInterfaceHandler } from './src/CanPlayAudioCheck';
import { RadioRequestHandler } from './src/utils/RadioRequestHandler';

export async function handler(event: RequestEnvelope, context: any, callback: any): Promise<void> {
    const factory = SkillBuilders.standard()
        .addRequestHandlers(
            CheckAudioInterfaceHandler,
            RadioRequestHandler.builder()
                .withHandlers(IntentHandler)
                //.withHandlers(AudioHandler)
                .build()
        ).addErrorHandlers(CustomErrorHandler);

    const skill = factory.create();

    try {

        console.log(JSON.stringify(event, null, 2));

        const responseEnvelope: ResponseEnvelope = await skill.invoke(event, context);

        console.log(JSON.stringify(responseEnvelope, null, 2));

        return callback(null, responseEnvelope);

    } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        return callback(error);
    }
}