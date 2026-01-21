export interface RBLXChallengeMetadata {
    userId: string;
    challengeId: string;
    shouldShowRememberDeviceCheckbox: false;
    rememberDevice: boolean;
    sessionCookie: string;
    verificationToken: string;
    actionType: "Generic",
    requestPath: "/v1/groups/{groupId}/payouts",
    requestMethod: "POST",
    sharedParameters: {
        shouldAnalyze: boolean,
        genericChallengeId: string,
        useContinueMode: boolean,
        renderNativeChallenge: boolean,
        delayParameters: boolean
    }
}

export interface AuthenticatorVerifyResponse {
    verificationToken: string;
}