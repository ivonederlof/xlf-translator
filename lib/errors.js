module.exports = {
    NO_PROJECT_NAME: {
        description: 'add a project name, we need store your src somewhere',
        code: 1000
    },
    NO_FROM_LANGUAGE: {
        description: 'We need to know the language of this file, please add a valid iso to the configuration (fromLanguage)',
        code: 1001
    },
    NO_TO_LANGUAGE: {
        description: 'We need to know to which language(s) we need to transform the data, please add a valid iso to the configuration file (toLanguage)',
        code: 1002
    },
    GOOGLE_LIMIT_REACHED: {
        description: 'The google translate api is blocking your requests, they have a limit (wait or use an vpn)',
        code: 1003
    },
    COULD_NOT_TRANSLATE: {
        description: 'Could not translate to this language',
        code: 1004
    },
    CONFIG_FILE_NOT_EXIST: {
        description: 'The config file does not exist, make sure you add the json file to the root of the project',
        code: 1005
    }
};
